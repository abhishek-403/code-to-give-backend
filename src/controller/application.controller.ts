import { Response } from "express";
import { ApplicationStatus } from "../lib/constants";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import { Application } from "../model/application.schema";
import { Event } from "../model/event.schema";
import { User } from "../model/user.schema";

export const createApplication = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    const ev = await Event.findOne({ _id: req.body.eventId });
    if (!user || !ev) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }
    if (user.myEvents?.includes(req.body.eventId)) {
      res.send(errorResponse(403, "Already Registered"));
      return;
    }

    const appId = await Application.create({
      ...req.body,
      applicantId: user._id,
    });
    user.myApplications?.push(appId._id);
    user.myEvents?.push(req.body.eventId);
    ev.applications?.push(appId._id);

    await user.save();
    await ev.save();
    res.send(successResponse(201, "Application created successfully"));
    return;
  } catch (error) {
    console.log(error);

    res.send(errorResponse(500, "Error creating application"));
    return;
  }
};
export const updateApplication = async (req: any, res: Response) => {
  try {
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedApplication) {
      res.send(errorResponse(404, "Application not found"));
      return;
    }
    res.send(successResponse(200, "Application updated successfully"));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error updating application"));
    return;
  }
};
export const updateApplicationStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.send(errorResponse(400, "Application ID is required"));
      return;
    }

    if (!status) {
      res.send(errorResponse(400, "Status field is required"));
      return;
    }

    const application = await Application.findById(id);
    if (!application) {
      res.send(errorResponse(404, "Application not found"));
      return;
    }
    application.status = status;
    await application.save();
    if (status === ApplicationStatus.APPROVED) {
      const event = await Event.findById(application.eventId);
      if (!event) {
        res.send(errorResponse(404, "Event not found"));
        return;
      }

      if (!event.volunteers) {
        event.volunteers = [];
      }

      if (!event.volunteers.includes(application.applicantId)) {
        event.volunteers.push(application.applicantId);
        await event.save();
      }
    }

    res.send(successResponse(200, "Application updated successfully"));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error updating application"));
    return;
  }
};
export const getApplication = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const application = await Application.findOne({ _id: id });
    res.send(successResponse(200, application));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error fetching applications"));
    return;
  }
};
export const getMyApplications = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const application = await Application.findOne({ applicantId: id });

    res.send(successResponse(200, application));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error fetching applications"));
    return;
  }
};
export const getMyActiveApplications = async (req: any, res: Response) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ uid });
    if (!user) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }
    const today = new Date();
    const application = await Application.find({ applicantId: user._id })
      .populate({
        path: "eventId",
        model: "Event",
        select: "name endDate description location",
        // match: { endDate: { $lt: today } },
      })
      .populate({
        path: "volunteeringDomain",
        model: "VolunteeringDomain",
        select: "name",
      })
      .exec();

    res.send(successResponse(200, application));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error fetching applications"));
    return;
  }
};
export const deleteApplication = async (req: any, res: Response) => {
  try {
    const deletedApplication = await Application.findByIdAndDelete(
      req.params.id
    );
    if (!deletedApplication) {
      res.send(errorResponse(404, "Application not found"));
      return;
    }
    res.send(successResponse(200, "Application deleted successfully"));
    return;
  } catch (error) {
    res.send(errorResponse(500, "Error deleting application"));
    return;
  }
};
