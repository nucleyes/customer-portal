import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, generateVerificationToken, validateRequest, JWT_SECRET } from "./auth";
import bcrypt from "bcrypt";
import { 
  insertUserSchema, 
  signUpSchema, 
  signInSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from "@shared/schema";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  const { passport, isAuthenticated, generateToken } = setupAuth(app, storage);

  // Authentication Routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = validateRequest(signUpSchema, req.body);
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(validatedData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        username: validatedData.username,
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      });
      
      // Generate verification token
      const verificationToken = generateVerificationToken();
      await storage.setVerificationToken(user.id, verificationToken);
      
      // In a real app, we would send an email with a verification link
      // For demonstration, we'll just return the token in the response
      res.status(201).json({ 
        message: "User registered successfully. Please check your email for verification.", 
        verificationToken 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", (req: Request, res: Response, next) => {
    try {
      // Validate request body
      validateRequest(signInSchema, req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          
          // Generate JWT token
          const token = generateToken(user.id);
          
          // Return user info (without password)
          const { password, ...userData } = user;
          return res.json({ 
            message: "Login successful",
            user: userData,
            token 
          });
        });
      })(req, res, next);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      
      const user = await storage.validateVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      
      res.json({ message: "Email verified successfully. You can now log in." });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = validateRequest(forgotPasswordSchema, req.body);
      
      const resetToken = await storage.setResetPasswordToken(validatedData.email);
      
      if (!resetToken) {
        // Don't reveal that the email doesn't exist
        return res.json({ message: "If the email exists, a password reset link has been sent." });
      }
      
      // In a real app, we would send an email with the reset link
      // For demonstration, we'll just return the token in the response
      res.json({ 
        message: "Password reset link sent to your email.", 
        resetToken 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = validateRequest(resetPasswordSchema, req.body);
      
      const user = await storage.validateResetPasswordToken(validatedData.token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Update password
      await storage.resetPassword(user.id, hashedPassword);
      
      res.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Protected routes
  app.get("/api/auth/me", isAuthenticated, (req: Request, res: Response) => {
    // Return the authenticated user
    const { password, ...user } = req.user as any;
    res.json(user);
  });

  app.put("/api/auth/profile", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { name, username } = req.body;
      
      // Simple validation
      if (!name && !username) {
        return res.status(400).json({ message: "No fields to update" });
      }
      
      // Check if username is taken (if username is being updated)
      if (username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ message: "Username already taken" });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, { name, username });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return updated user without password
      const { password, ...userData } = updatedUser;
      res.json(userData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // API route to validate JWT token
  app.post("/api/auth/validate-token", (req: Request, res: Response) => {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ valid: false, message: "No token provided" });
    }
    
    try {
      jwt.verify(token, JWT_SECRET);
      res.json({ valid: true });
    } catch (error) {
      res.json({ valid: false, message: "Invalid or expired token" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
