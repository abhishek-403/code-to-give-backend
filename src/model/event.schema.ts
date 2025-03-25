// event.model.ts
import mongoose, { Schema } from "mongoose";
import { IEvent } from "../dto/event.dto";
import { Availabitity, EventStatus } from "../lib/constants";

const EventSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      required: true,
      default: EventStatus.ACTIVE,
    },
    location: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      // validate: {
      //   validator: function (this: IEvent) {
      //     if (!this.startDate || !this.endDate) return false;
      //     return this.endDate >= this.startDate;
      //   },
      //   message: "End date must be after or equal to start date",
      // },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    volunteeringDomains: [
      {
        type: Schema.Types.ObjectId,
        ref: "VolunteeringDomain",
        required: true,
      },
    ],
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
        default: [],
      },
    ],
    availability: {
      type: [String],
      enum: Object.values(Availabitity),
      required: true,
    },
    capacity: {
      type: Number,
      min: 1,
    },
    template: {
      type: Schema.Types.ObjectId,
      ref: "TemplateForm",
    },
    volunteers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
        default: [],
      },
    ],
    feedbacks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
      default: [],
    },
  },
  { timestamps: true }
);

// Add index for faster queries
EventSchema.index({ startDate: 1, endDate: 1 });
EventSchema.index({ isTemplate: 1 });

// Virtual for checking if event is at capacity
// EventSchema.virtual("isAtCapacity").get(function (this: IEvent) {
//   if (!this.capacity) return false;
//   return this.applications && this.applications.length >= this.capacity;
// });

export const Event = mongoose.model<IEvent>("Event", EventSchema);
