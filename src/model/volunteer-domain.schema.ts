import mongoose, { Schema } from "mongoose";
import { IVolunteeringDomain } from "../dto/volunteer-domain.dto";

const VolunteeringDomainSchema: Schema = new Schema(
    {
      id: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },
      name: {
        type: String,
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
        ref: 'User',
        required: true,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  export const VolunteeringDomain = mongoose.model<IVolunteeringDomain>(
    'VolunteeringDomain',
    VolunteeringDomainSchema
  );