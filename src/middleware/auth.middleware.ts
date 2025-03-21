import { NextFunction, Request, Response } from "express";
import admin from "../config/firebaseConfig";
import { errorResponse } from "../lib/responseWrappper";

const requireUserMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.send(errorResponse(401, "Unauthorized"));
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (e) {
    res.send(errorResponse(401, "Unauthorized"));
    return;
  }
};
export const checkUserMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = null;
    next();
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (e) {
    
    res.send(errorResponse(401, "Unauthorized"));
    return;
  }
};

export default requireUserMiddleware;
