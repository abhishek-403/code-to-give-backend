import { Response, NextFunction } from "express";
import { errorResponse } from "../lib/responseWrappper";
import { UserRole } from "../lib/constants";
import User from "../model/user.schema";

export const authorizeRole =
  (requiredRole: UserRole) =>
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.uid) {
      res.send(errorResponse(401, "Unauthorized"));
      return;
    }

    try {
      const user = await User.findOne({ uid: req.user.uid });

      if (user && user.role === UserRole.ADMIN) {
        next();
        return;
      }
      if (!user || user.role !== requiredRole) {
        res.send(errorResponse(403, "Forbidden"));
        return;
      }

      next();
    } catch (e) {
      res.send(errorResponse(500, "Server Error"));
      return;
    }
  };
