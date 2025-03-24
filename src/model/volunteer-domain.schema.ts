import mongoose, { Schema } from "mongoose";
import { IVolunteeringDomain } from "../dto/volunteer-domain.dto";

const VolunteeringDomainSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const VolunteeringDomain = mongoose.model<IVolunteeringDomain>(
  "VolunteeringDomain",
  VolunteeringDomainSchema
);
