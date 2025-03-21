import { Types } from "mongoose";
import { AuthProviders, UserRole } from "../lib/constants";

export interface UserDto {
  uid: string;
  name: string;
  email: string;
  role?: UserRole;
  profileImage?: string;
  contact?: string;
  authProvider: AuthProviders;
  age?: Number;
  location?:string;
  applications?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
