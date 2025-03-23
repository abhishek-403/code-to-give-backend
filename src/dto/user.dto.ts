import { Document } from 'mongoose';
import { UserRole } from '../lib/constants';
export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role: UserRole;
  authProvider: 'email' | 'google';
  age?: number;
  location?: string;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  uid: string;
  email: string;
  displayName: string;
  profileImage?: string;
  role?: UserRole;
  authProvider: 'email' | 'google';
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
