import mongoose, { Schema, Document } from "mongoose";
import { AvailabilityType } from "./event.dto";
import { ApplicationStatus } from "../lib/constants";


export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  volunteeringDomain: mongoose.Types.ObjectId;
  status: ApplicationStatus;
  willingStartDate: Date;
  willingEndDate: Date;
  availability: AvailabilityType;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}


// DTOs
export interface CreateApplicationDto {
  eventId: mongoose.Types.ObjectId;
  applicantId: mongoose.Types.ObjectId;
  volunteeringDomain: mongoose.Types.ObjectId;
  willingStartDate: Date;
  willingEndDate: Date;
  availability: AvailabilityType;
  notes?: string;
}

export interface UpdateApplicationDto {
  status?: ApplicationStatus;
  willingStartDate?: Date;
  willingEndDate?: Date;
  availability?: AvailabilityType;
  reviewedBy?: mongoose.Types.ObjectId;
  notes?: string;
}

export interface ReviewApplicationDto {
  status: "approved" | "rejected";
  reviewedBy: mongoose.Types.ObjectId;
  notes?: string;
}
