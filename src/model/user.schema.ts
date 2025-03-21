import mongoose, { Schema, Document } from "mongoose";
import { UserDTO } from "../dto/user.dto";
import { AuthProviders, UserRole } from "../lib/constants";

export interface IUser extends UserDTO, Document {}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    profileImage: { type: String, default: "" },
    authProvider: {
      type: String,
      enum: Object.values(AuthProviders),
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
