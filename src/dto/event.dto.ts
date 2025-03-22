import { Types } from "mongoose";
import { Availabitity, VolunteerDomains } from "../lib/constants";

export interface CreateEventDto {
  createdBy: Types.ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  volunteerDomain: VolunteerDomains[];
  application?: Types.ObjectId;
  availability: Availabitity[];
}
