import { Types } from "mongoose";
import { FeedBackSentiment } from "../lib/constants";

export interface CreateFeedBackDto {
  applicantId: Types.ObjectId;
  eventId: Types.ObjectId;
  sentement?: FeedBackSentiment;
  description: string;
  date: Date;
}
