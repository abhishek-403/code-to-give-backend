import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
  eventId: mongoose.Types.ObjectId;
  respondentId: mongoose.Types.ObjectId;
  formId: string; 
  responses: Record<string, any>; 
  submittedAt: Date;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}