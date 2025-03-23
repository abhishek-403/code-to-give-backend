import { Response } from "express";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import { User } from "../model/user.schema";
import { Event } from "../model/event.schema";

export const createBulkEvent = async (req: any, res: Response) => {
  try {
    const creator = await User.findOne({ uid: req.user.uid });
    if (!creator) {
      return res.status(401).send(errorResponse(401, "Unauthorized"));
    }

    const eventsData = req.body;
    if (!Array.isArray(eventsData) || eventsData.length === 0) {
      return res.status(400).send(errorResponse(400, "Invalid events data"));
    }

    const eventsWithCreator = eventsData.map((event) => ({
      ...event,
      createdBy: creator._id,
    }));

    const events = await Event.insertMany(eventsWithCreator);
    res.send(successResponse(200, "Events added"));
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};
export const createEvent = async (req: any, res: Response) => {
  try {
    const creator = await User.findOne({ uid: req.user.uid });
    if (!creator) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }
    const eventsData = req.body;
    const eventsWithCreator = {
      ...eventsData,
      createdBy: creator._id,
    };
    const event = await Event.create(eventsWithCreator);

    res.send(successResponse(200, { eventId: event._id, msg: "Event Added!" }));
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Internal Error"));
    return;
  }
};
export const editEvent = async (req: any, res: Response) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedEvent) {
      res.status(404).json({ message: "Event not found" });
      return;
    }
    res.send(successResponse(200, "Event Edited!"));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const deleteEvent = async (req: any, res: Response) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      res.send(errorResponse(404, "Event not found"));
      return;
    }
    res.send(successResponse(200, "Event deleted successfully"));
  } catch (error) {
    res.send(errorResponse(500, "Error deleting event"));
  }
};
export const getEventById = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const event = await Event.findOne({ _id: id });
    if (!event) {
      res.send(errorResponse(404, "No event"));
      return;
    }
    res.send(successResponse(200, event));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const getActiveEvents = async (req: any, res: Response) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const events = await Event.find({}).skip(skip).limit(limit);

    const totalEvents = await Event.countDocuments();
    res.send(
      successResponse(200, {
        events,
        pagination: {
          total: totalEvents,
          page: pageNum,
          limit: limitNum,
          hasMore: skip + events.length < totalEvents,
        },
      })
    );
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
