import mongoose, { Schema } from "mongoose";
import { CreateTaskDto } from "../dto/tasks.dto";
import { TaskStatus } from "../lib/constants";

export interface ITask extends CreateTaskDto, Document {}

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
