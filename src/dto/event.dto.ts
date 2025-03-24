import mongoose, { Document } from "mongoose";
import { Availabitity } from "../lib/constants";

export type AvailabilityType = Availabitity | string[];

// export interface IEventVolunteeringDomain {
//   domain: mongoose.Types.ObjectId;
//   customName?: string;
//   customDescription?: string;
// }

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
  volunteeringDomains: mongoose.Types.ObjectId[];
  availability: AvailabilityType;
  template?: mongoose.Types.ObjectId;
  applications?: mongoose.Types.ObjectId[];
  capacity?: number;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs

export interface UpdateEventDto {
  name?: string;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  volunteeringDomains?: {
    domain: mongoose.Types.ObjectId;
    customName?: string;
    customDescription?: string;
  }[];
  availability?: AvailabilityType;
  isTemplate?: boolean;
  templateName?: string;
}

export interface EventTemplateDto {
  templateName: string;
  event: mongoose.Types.ObjectId;
}
