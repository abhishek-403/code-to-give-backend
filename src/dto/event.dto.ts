import mongoose, { Document } from "mongoose";
import { Availabitity, EventStatus } from "../lib/constants";

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
  status: EventStatus;
  createdBy: mongoose.Types.ObjectId;
  volunteeringDomains: mongoose.Types.ObjectId[];
  availability: AvailabilityType;
  template?: mongoose.Types.ObjectId;
  applications?: mongoose.Types.ObjectId[];
  volunteers?: mongoose.Types.ObjectId[];
  tasks?: mongoose.Types.ObjectId[];
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
