import mongoose, { Document } from "mongoose";

export interface IVolunteeringDomain extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  isDefault: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateVolunteeringDomainDto {
  name: string;
  description?: string;
  isDefault?: boolean;
  createdBy: mongoose.Types.ObjectId;
}

export interface UpdateVolunteeringDomainDto {
  name?: string;
  description?: string;
  isDefault?: boolean;
}
