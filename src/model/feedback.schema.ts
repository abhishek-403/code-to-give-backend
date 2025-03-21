import mongoose, { Schema } from "mongoose";
import { CreateFeedBackDto } from "../dto/feedback.dto";
import { FeedBackSentiment } from "../lib/constants";

export interface IFeedback extends CreateFeedBackDto, Document {}

const feedbackSchema = new Schema<IFeedback>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event", 
      required: true,
    },
    sentement: {
      type: String,
      enum: Object.values(FeedBackSentiment),
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
