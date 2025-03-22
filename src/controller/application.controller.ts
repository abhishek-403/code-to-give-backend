import { Response } from "express";
import { errorResponse, successResponse } from "../lib/responseWrappper";
import Application from "../model/application.schema";
import User from "../model/user.schema";

export const createApplication = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }
    await Application.create({
      ...req.body,
      applicantId: user._id,
    });
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
