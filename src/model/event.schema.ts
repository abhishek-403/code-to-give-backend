import mongoose, { Schema } from "mongoose";
import { AvailabilityType, IEvent } from "../dto/event.dto";
import { Availabitity } from "../lib/constants";
// const EventVolunteeringDomainSchema: Schema = new Schema({
//   domain: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "VolunteeringDomain",
//     required: true,
//   },
//   customName: {
//     type: String,
//   },
//   customDescription: {
//     type: String,
//   },
// });

const EventSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      required: true,
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    volunteeringDomains: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VolunteeringDomain",
        required: true,
      },
    ],
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    availability: [
      {
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
            'Availability must be "Week ends", "Week days", "Both", or an array of days',
        },
        index: true,
      },
    ],
    isTemplate: {
      type: Boolean,
      default: false,
      index: true,
    },
    templateName: {
      type: String,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for querying events by date range
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ isTemplate: 1, createdBy: 1 });

export const Event = mongoose.model<IEvent>("Event", EventSchema);
