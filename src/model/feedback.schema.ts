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
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      index: true,
      default: 5, // Default matches frontend state
    },
    experience: {
      type: String,
      trim: true,
      required: false,
    },
    wouldRecommend: {
      type: Boolean,
      required: true,
      default: true, // Matches frontend default value
    },
    learnings: {
      type: String,
      trim: true,
      required: false,
    },
    suggestions: {
      type: String,
      trim: true,
      required: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔹 Compound Indexes for Faster Queries
FeedbackSchema.index({ eventId: 1, respondentId: 1 });
FeedbackSchema.index({ eventId: 1, submittedAt: 1 });
FeedbackSchema.index({ eventId: 1, rating: 1 });

export const Feedback = mongoose.model<IFeedback>("Feedback", FeedbackSchema);
