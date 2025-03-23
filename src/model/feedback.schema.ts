// Simple Feedback Schema
import mongoose, { Schema, Document } from "mongoose";
import { IFeedback } from "../dto/feedback.dto";

const FeedbackSchema: Schema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    respondentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    formId: {
      type: String,
      required: true,
      index: true,
    },
    responses: {
      type: Schema.Types.Mixed, // Flexible schema for any Google Form data structure
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    overallRating: {
      type: Number,
      min: 1,
      max: 5,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for analytics
FeedbackSchema.index({ eventId: 1, submittedAt: 1 });
FeedbackSchema.index({ eventId: 1, overallRating: 1 });

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
