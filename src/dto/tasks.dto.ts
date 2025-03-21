import { Types } from "mongoose";
import { Availabitity, TaskStatus } from "../lib/constants";

export interface CreateTaskDto {
  name: string;
  description: string;
  status: TaskStatus;
  eventId: Types.ObjectId;
  applicantId: Types.ObjectId;
}
