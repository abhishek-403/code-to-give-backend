import { Types } from "mongoose";
import { ApplicationStatus, Availabitity } from "../lib/constants";

export interface CreateApplicationDto {
  status: ApplicationStatus;
  applicantId: Types.ObjectId;
  eventId: Types.ObjectId;
  availability: Availabitity;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
// export interface CreateApplicationDto {
//   status: ApplicationStatus;
//   volunteerDomain: string;
//   location: string;
//   applicantId: Types.ObjectId;
//   availability: Availabitity;
//   startDate: Date;
//   endDate: Date;
//   createdAt?: Date;
//   updatedAt?: Date;
// }
