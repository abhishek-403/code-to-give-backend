import mongoose, { Document } from "mongoose";
import { Availabitity } from "../lib/constants";

export type AvailabilityType = Availabitity | string[];

export interface IEventVolunteeringDomain {
  domain: mongoose.Types.ObjectId;
  customName?: string;
  customDescription?: string;
}

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
  volunteeringDomains: IEventVolunteeringDomain[];
  availability: AvailabilityType;
  isTemplate: boolean;
  templateName?: string;
  templateId?: mongoose.Types.ObjectId;
  applications?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateEventDto {
  name: string;
  description?: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
  volunteeringDomains: {
    domain: mongoose.Types.ObjectId;
    customName?: string;
    customDescription?: string;
  }[];
  availability: AvailabilityType;
  isTemplate?: boolean;
  templateName?: string;
  templateId?: mongoose.Types.ObjectId;
}

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
