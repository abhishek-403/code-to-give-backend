import mongoose from "mongoose";
import { Schema } from "mongoose";
import { AvailabilityType } from "../dto/event.dto";
import { Availabitity } from "../lib/constants";
import { IApplication } from "../dto/application.dto";

const ApplicationSchema: Schema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    volunteeringDomain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VolunteeringDomain",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    willingStartDate: {
      type: Date,
      required: true,
    },
    willingEndDate: {
      type: Date,
      required: true,
    },
    availability: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (v: AvailabilityType) {
          if (typeof v === "string") {
            return Object.values(Availabitity).includes(v);
          }
          return Array.isArray(v);
        },
        message:
          'Availability must be "weekend", "weekday", "both", or an array of days',
      },
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for analytics
ApplicationSchema.index({ eventId: 1, status: 1 });
ApplicationSchema.index({ applicantId: 1, status: 1 });
ApplicationSchema.index({ volunteeringDomain: 1, status: 1 });
ApplicationSchema.index({ willingStartDate: 1, willingEndDate: 1 });

export const Application = mongoose.model<IApplication>(
  "Application",
  ApplicationSchema
);
