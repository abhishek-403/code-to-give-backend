import mongoose, { Schema, Document } from "mongoose";
import { UserDto } from "../dto/user.dto";
import { AuthProviders, UserRole } from "../lib/constants";

export interface IUser extends UserDto, Document {}

const userSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    contact: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
      required: true,
    },
    profileImage: { type: String, default: "" },
    authProvider: {
      type: String,
      enum: Object.values(AuthProviders),
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Application",
      },
    ],
    age: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, uid: 1 });
export default mongoose.model<IUser>("User", userSchema);
