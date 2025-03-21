import mongoose, { Schema } from "mongoose";
import { CreateEventDto } from "../dto/event.dto";
import { ApplicationStatus, Availabitity } from "../lib/constants";

export interface IEvent extends CreateEventDto, Document {}

const eventSchema = new Schema<IEvent>(
  {
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
    volunteerDomain: {
      type: String,
      required: true,
    },
    availability: {
      type: [String],
      enum: Object.values(Availabitity),
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
