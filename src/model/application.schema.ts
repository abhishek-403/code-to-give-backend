import mongoose, { Schema } from "mongoose";
import { CreateApplicationDto } from "../dto/application.dto";
import { ApplicationStatus, Availabitity } from "../lib/constants";

export interface IApplication extends CreateApplicationDto, Document {}

const applicationSchema = new Schema<IApplication>(
  {
    status: {
      type: String,
      default: ApplicationStatus.PENDING,
      enum: Object.values(ApplicationStatus),
      required: true,
    },

    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    availability: {
      type: String,
      enum: Object.values(Availabitity),
      default: Availabitity.WEEKENDS,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
