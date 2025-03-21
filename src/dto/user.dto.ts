import { AuthProviders, UserRole } from "../lib/constants";

export interface UserDTO {
  uid: string;
  name: string;
  email: string;
  role?: UserRole;
  profileImage?: string;
  authProvider: AuthProviders;
  createdAt?: Date;
  updatedAt?: Date;
}
