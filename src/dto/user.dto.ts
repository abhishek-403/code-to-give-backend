import { Document, Types } from "mongoose";
import { AuthProviders, UserRole } from "../lib/constants";
export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role: UserRole;
  authProvider: AuthProviders;
  age?: number;
  location?: string;
  interests?: string[];
  myApplications?: Types.ObjectId[];
  myEvents?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role?: UserRole;
  authProvider: AuthProviders;
  age?: number;
  location?: string;
  interests?: string[];
}

export interface UpdateUserDto {
  displayName?: string;
  profileImage?: string;
  role?: UserRole;
  age?: number;
  location?: string;
  interests?: string[];
}
