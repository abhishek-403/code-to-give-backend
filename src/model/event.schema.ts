import mongoose, { Schema } from "mongoose";
import { CreateEventDto } from "../dto/event.dto";
import {
  ApplicationStatus,
  Availabitity,
  VolunteerDomains,
} from "../lib/constants";

export interface IEvent extends CreateEventDto, Document {}

const eventSchema = new Schema<IEvent>(
  {
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    volunteerDomain: [
      {
        type: String,
        enum: Object.values(VolunteerDomains),
        required: true,
        default: VolunteerDomains.VIEWER,
      },
    ],
    availability: {
      type: [String],
      enum: Object.values(Availabitity),
      required: true,
    },
    application: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
