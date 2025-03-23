import mongoose, { Schema, Document } from "mongoose";

export type TaskStatus = "assigned" | "in_progress" | "completed" | "cancelled";

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  eventId: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// DTOs
export interface CreateTaskDto {
  name: string;
  description?: string;
  eventId: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  assignedBy: mongoose.Types.ObjectId;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
}

export interface UpdateTaskDto {
  name?: string;
  description?: string;
  status?: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  priority?: "low" | "medium" | "high";
  completedAt?: Date;
}
