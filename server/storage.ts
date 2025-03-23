import { users, type User, type InsertUser } from "@shared/schema";
import { randomBytes } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  setVerificationToken(id: number, token: string): Promise<User | undefined>;
  validateVerificationToken(token: string): Promise<User | undefined>;
  setResetPasswordToken(email: string): Promise<string | undefined>;
  validateResetPasswordToken(token: string): Promise<User | undefined>;
  resetPassword(id: number, password: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.googleId === googleId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      emailVerified: false,
      verificationToken: null,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      googleId: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async setVerificationToken(id: number, token: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, verificationToken: token };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async validateVerificationToken(token: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(
      (user) => user.verificationToken === token,
    );

    if (!user) return undefined;

    const updatedUser = { ...user, emailVerified: true, verificationToken: null };
    this.users.set(user.id, updatedUser);
    return updatedUser;
  }

  async setResetPasswordToken(email: string): Promise<string | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const token = randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1); // token expires in 1 hour

    const updatedUser = { ...user, resetPasswordToken: token, resetPasswordExpires };
    this.users.set(user.id, updatedUser);
    return token;
  }

  async validateResetPasswordToken(token: string): Promise<User | undefined> {
    const user = Array.from(this.users.values()).find(
      (user) => user.resetPasswordToken === token,
    );

    if (!user) return undefined;
    
    // Check if token is expired
    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      return undefined;
    }

    return user;
  }

  async resetPassword(id: number, password: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, password, resetPasswordToken: null, resetPasswordExpires: null };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
