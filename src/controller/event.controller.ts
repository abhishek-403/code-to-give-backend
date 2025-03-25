import { Response } from "express";
import mongoose from "mongoose";
import { CreateVolunteeringDomainDto } from "../dto/volunteer-domain.dto";
import { ApplicationStatus } from "../lib/constants";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import { Event } from "../model/event.schema";
import { Task } from "../model/task.schema";
import { TemplateFormModel } from "../model/template.schema";
import { User } from "../model/user.schema";
import { VolunteeringDomain } from "../model/volunteer-domain.schema";

export const createBulkEvent = async (req: any, res: Response) => {
  try {
    const creator = await User.findOne({ uid: req.user.uid });
    if (!creator) {
      res.status(401).send(errorResponse(401, "Unauthorized"));
      return;
    }

    const eventsData = req.body;
    if (!Array.isArray(eventsData) || eventsData.length === 0) {
      res.status(400).send(errorResponse(400, "Invalid events data"));
      return;
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

export const createVolunteeringDomain = async (req: any, res: Response) => {
  try {
    const { name }: CreateVolunteeringDomainDto = req.body;
    const user = await User.findOne({ uid: req.user.uid });
    if (!name || !user) {
      res.send(errorResponse(400, "Name and user are required"));
      return;
    }
    const isDuplicate = await VolunteeringDomain.findOne({ name });
    if (isDuplicate) {
      res.send(errorResponse(400, "Dmain already exists"));
      return;
    }
    const createdBy = user._id;

    const existingDomain = await VolunteeringDomain.findOne({ name });
    if (existingDomain) {
      res.send(errorResponse(409, "Domain with this name already exists"));
      return;
    }

    const newDomain = await VolunteeringDomain.create({
      name,
      createdBy,
    });
    res.send(successResponse(201, "New domain created"));
  } catch (error) {
    console.error(error);
    res.status(500).send(errorResponse(500, "Internal Server Error"));
  }
};
// export const createEvent = async (req: any, res: Response) => {
//   try {
//     const creator = await User.findOne({ uid: req.user.uid });
//     if (!creator) {
//       res.send(errorResponse(401, "Unauthorized"));
//       return;
//     }
//     const eventsData = req.body;
//     const eventsWithCreator = {
//       ...eventsData,
//       createdBy: creator._id,
//     };
//     const event = await Event.create(eventsWithCreator);

//     res.send(successResponse(200, { eventId: event._id, msg: "Event Added!" }));
//   } catch (error) {
//     console.log(error);

//     res.send(errorResponse(500, "Internal Error"));
//     return;
//   }
// };

// Explicitly type the Request if possible (optional, but recommended)

export const createEvent = async (req: any, res: Response) => {
  try {
    const creator = await User.findOne({ uid: req.user.uid });
    if (!creator) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }

    let {
      name,
      description,
      location,
      startDate,
      endDate,
      availability,
      capacity,
      volunteeringDomains,
      formFields,
      saveAsTemplate,
      templateName,
    } = req.body;

    if (saveAsTemplate && !templateName.trim()) {
      res.send(errorResponse(400, "Template name required"));
      return;
    }

    if (
      !name ||
      !description ||
      !location ||
      !startDate ||
      !endDate ||
      !availability
    ) {
      res.send(errorResponse(400, "Missing required fields"));
      return;
    }

    if (
      !Array.isArray(volunteeringDomains) ||
      volunteeringDomains.length === 0
    ) {
      res.send(
        errorResponse(400, "At least one volunteering domain is required")
      );
      return;
    }

    // Convert domain names to ObjectIds and validate.
    const volunteeringDomainIds: mongoose.Types.ObjectId[] = volunteeringDomains
      .map((id: string) => {
        if (mongoose.isValidObjectId(id)) {
          return new mongoose.Types.ObjectId(id);
        } else {
          console.warn(`Invalid ObjectId encountered: ${id}`);
          return null;
        }
      })
      .filter(Boolean) as mongoose.Types.ObjectId[];

    if (volunteeringDomainIds.length !== volunteeringDomains.length) {
      res.send(errorResponse(400, "Invalid volunteering domain(s) provided."));
      return;
    }

    const existingCount = await VolunteeringDomain.countDocuments({
      _id: { $in: volunteeringDomainIds },
    });

    if (existingCount !== volunteeringDomainIds.length) {
      res.send(errorResponse(400, "Invalid volunteering domain(s) provided."));
      return;
    }

    if (!Array.isArray(availability) || availability.length === 0) {
      res.send(errorResponse(400, "Availability options are required"));
      return;
    }

    let templateForm;
    if (
      Array.isArray(formFields) &&
      formFields.length > 0 &&
      templateName.trim()
    ) {
      templateForm = await TemplateFormModel.create({
        name: templateName,
        fields: formFields,
        isSaved: saveAsTemplate,
      });
    }

    const newEvent: any = await Event.create({
      name,
      description,
      location,
      startDate,
      endDate,
      createdBy: creator._id,
      volunteeringDomains: volunteeringDomainIds,
      availability,
      capacity,
      isTemplate: saveAsTemplate,
    });

    if (newEvent && templateForm) {
      newEvent.template = templateForm._id;
    }

    await newEvent.save();

    res.send(successResponse(201, newEvent._id));
  } catch (error) {
    console.error(error);
    res.send(errorResponse(500, "Internal Server Error"));
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
export const getVolunteeringDomain = async (req: any, res: Response) => {
  try {
    const vol = await VolunteeringDomain.find();
    const formatted = vol.map((v) => ({
      name: v.name,
      _id: v._id,
    }));
    res.send(successResponse(200, formatted));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const getAllTemplates = async (req: any, res: Response) => {
  try {
    const template = await TemplateFormModel.find({ isSaved: true });

    res.send(successResponse(200, template));
  } catch (error) {
    res.send(errorResponse(500, "Internal Error"));
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
    const {
      page = 1,
      limit = 5,
      activeTab,
      city,
      domain,
      availability,
      startDate,
      endDate,
      searchQuery,
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query filters
    let query: any = {};

    // Apply activeTab filter (assuming it determines past/upcoming events)
    if (activeTab && activeTab !== "all") {
      const currentDate = new Date();
      if (activeTab === "upcoming") {
        query.startDate = { $gte: currentDate };
      } else if (activeTab === "past") {
        query.endDate = { $lt: currentDate };
      }
    }

    // Apply city filter
    if (city) {
      query.location = city;
    }

    // Apply domain filter (assuming it's stored as an ObjectId reference)
    if (domain) {
      query.volunteeringDomains = { $in: domain };
    }

    // Apply availability filter
    if (availability) {
      query.availability = { $in: availability };
    }

    // Apply date range filters
    if (startDate) {
      query.startDate = {
        ...query.startDate,
        $gte: new Date(startDate as string),
      };
    }

    if (endDate) {
      query.endDate = { ...query.endDate, $lte: new Date(endDate as string) };
    }
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery.split(/\s+/).join(".*"), "i"); // Matches words with spaces

      query.$or = [
        { name: searchRegex }, // Matches "Community Health Camp" when searching "camp"
        { description: searchRegex },
        { location: searchRegex },
      ];
    }
    // Execute query with filters

    const events = await Event.find(query)
      .populate("volunteeringDomains")
      .populate("template")
      .populate({
        path: "applications",
        // match: { status: ApplicationStatus.PENDING },
        populate: {
          path: "volunteeringDomain",
          model: "VolunteeringDomain",
        },
      })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Count total filtered events
    const totalEvents = await Event.countDocuments(query);

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
    console.log(error);
    res.send(errorResponse(500, "Internal Error"));
  }
};
export const addTaskToEvent = async (req: any, res: Response) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      description,
      assignedTo,
      assignedBy,
      startDate,
      endDate,
      priority,
    } = req.body;

    // Check if event

    const event = await Event.findById(eventId);
    if (!event) {
      res.send(errorResponse(404, "Event not found"));
      return;
    }

    // Create new task
    const task = await Task.create({
      name,
      description,
      eventId,
      assignedTo,
      assignedBy,
      startDate,
      endDate,
      priority,
    });

    event.tasks = event.tasks || [];
    event.tasks.push(task._id);
    event.tasks.push(task._id);
    await event.save();

    res.send(successResponse(201, "Task added to event successfully"));
    return;
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Error adding task to event"));
    return;
  }
};
export const getActiveEventsAdmin = async (req: any, res: Response) => {
  try {
    const {
      page = 1,
      limit = 5,
      activeTab,
      city,
      domain,
      availability,
      startDate,
      endDate,
      searchQuery,
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build query filters
    let query: any = {};

    // Apply activeTab filter (assuming it determines past/upcoming events)
    if (activeTab && activeTab !== "all") {
      const currentDate = new Date();
      if (activeTab === "upcoming") {
        query.startDate = { $gte: currentDate };
      } else if (activeTab === "past") {
        query.endDate = { $lt: currentDate };
      }
    }

    // Apply city filter
    if (city) {
      query.location = city;
    }

    // Apply domain filter (assuming it's stored as an ObjectId reference)
    if (domain) {
      query.volunteeringDomains = { $in: domain };
    }

    // Apply availability filter
    if (availability) {
      query.availability = { $in: availability };
    }

    // Apply date range filters
    if (startDate) {
      query.startDate = {
        ...query.startDate,
        $gte: new Date(startDate as string),
      };
    }

    if (endDate) {
      query.endDate = { ...query.endDate, $lte: new Date(endDate as string) };
    }
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery.split(/\s+/).join(".*"), "i"); // Matches words with spaces

      query.$or = [
        { name: searchRegex }, // Matches "Community Health Camp" when searching "camp"
        { description: searchRegex },
        { location: searchRegex },
      ];
    }
    // Execute query with filters

    const events = await Event.find(query)
      .populate("volunteeringDomains")
      .populate("template")
      .populate("volunteers")
      .populate("tasks")
      .populate({
        path: "applications",
        match: { status: ApplicationStatus.PENDING },
        populate: {
          path: "volunteeringDomain",
          model: "VolunteeringDomain",
        },
      })
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Count total filtered events
    const totalEvents = await Event.countDocuments(query);

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
    console.log(error);
    res.send(errorResponse(500, "Internal Error"));
  }
};

export const getVolunteerSideEventInfo = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    const eventId = req.params.eventId;

    if (!user) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }
    if (!eventId) {
      res.send(errorResponse(401, "Event Id required"));
      return;
    }
    const alltasks = await Task.find({ assigedTo: user._id, eventId });
    res.send(successResponse(200, alltasks));
  } catch (e) {
    console.log(e);
    res.send(errorResponse(500, "Internal Error"));
  }
};
