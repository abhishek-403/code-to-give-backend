import { Availabitity } from "../lib/constants";

export interface CreateEventDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  volunteerDomain: string;
  availability: Availabitity[];
}
