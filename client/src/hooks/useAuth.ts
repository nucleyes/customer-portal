import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface User {
  id: number;
  username: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  googleId: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

export function useAuth() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get token from localStorage
  const getToken = useCallback(() => {
    return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
  }, []);

  // Set token in storage (localStorage for rememberMe, sessionStorage otherwise)
  const setToken = useCallback((token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem("auth_token", token);
    } else {
      sessionStorage.setItem("auth_token", token);
      localStorage.removeItem("auth_token");
    }
  }, []);

  // Remove token from storage
  const removeToken = useCallback(() => {
    localStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_token");
  }, []);

  // Check if token is valid
  const validateToken = useCallback(async (token: string) => {
    try {
      const response = await apiRequest("POST", "/api/auth/validate-token", { token });
      const data = await response.json();
      return data.valid;
    } catch (error) {
      return false;
    }
  }, []);

  // Fetch current user
  const { data: user, isLoading, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async ({ queryKey }) => {
      // Return a mock user for testing when auth is disabled
      return {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
        googleId: null
      };
    },
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", "/api/auth/register", userData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration successful",
        description: "Please check your email for verification.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; rememberMe?: boolean }) => {
      // Simulate successful login when auth is disabled
      return {
        message: "Login successful",
        user: {
          id: 1,
          username: "testuser",
          email: "test@example.com",
          name: "Test User",
          emailVerified: true,
          googleId: null
        },
        token: "mock-token",
        rememberMe: credentials.rememberMe
      };
    },
    onSuccess: (data) => {
      setToken(data.token, !!data.rememberMe);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });
      
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/auth/logout", undefined);
      return response.json();
    },
    onSuccess: () => {
      removeToken();
      queryClient.setQueryData(["/api/auth/me"], null);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
        variant: "default",
      });
      
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", { email });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Reset link sent",
        description: "If the email exists, a password reset link has been sent.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send reset link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { password: string; confirmPassword: string; token: string }) => {
      const response = await apiRequest("POST", "/api/auth/reset-password", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password.",
        variant: "default",
      });
      
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { name?: string; username?: string }) => {
      const response = await apiRequest("PUT", "/api/auth/profile", profileData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/me"], data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await fetch(`/api/auth/verify-email?token=${token}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to verify email");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully. You can now log in.",
        variant: "default",
      });
      
      setLocation("/auth");
    },
    onError: (error: Error) => {
      toast({
        title: "Email verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle Google authentication (to be implemented with Google OAuth)
  const handleGoogleAuth = () => {
    // Redirect to Google OAuth endpoint
    // This would typically be handled by the backend
    toast({
      title: "Google Authentication",
      description: "Google authentication is not implemented in this demo.",
      variant: "default",
    });
  };

  // Determine auth state
  const authState: AuthState = {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    token: getToken(),
  };

  return {
    ...authState,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    resetPassword: resetPasswordMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    verifyEmail: verifyEmailMutation.mutate,
    handleGoogleAuth,
    isRegisterLoading: registerMutation.isPending,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
    isForgotPasswordLoading: forgotPasswordMutation.isPending,
    isResetPasswordLoading: resetPasswordMutation.isPending,
    isUpdateProfileLoading: updateProfileMutation.isPending,
    isVerifyEmailLoading: verifyEmailMutation.isPending,
  };
}
