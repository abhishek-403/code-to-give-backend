import mongoose, { Schema } from "mongoose";
import { IUser } from "../dto/user.dto";
import { AuthProviders, UserRole } from "../lib/constants";

const UserSchema: Schema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    authProvider: {
      type: String,
      enum: Object.values(AuthProviders),
      required: true,
    },
    age: {
      type: Number,
    },
    location: {
      type: String,
    },
    interests: {
      type: [String],
      default: [],
    },
    volunteeringInterests: [
      {
        type: mongoose.Types.ObjectId,
        ref: "VolunteeringDomain",
        default: [],
      },
    ],
    myApplications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    myEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Events",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for query optimization
UserSchema.index({ role: 1 });
UserSchema.index({ location: 1 });
UserSchema.index({ interests: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
