import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplication,
  getMyApplications,
  updateApplication,
} from "./controller/application.controller";
import {
  createEvent,
  deleteEvent,
  editEvent,
  getActiveEvents,
  getEventById,
} from "./controller/event.controller";
import {
  createUser,
  getUserById,
  googleLogin,
} from "./controller/user.controller";
import { UserRole } from "./lib/constants";
import requireUserMiddleware from "./middleware/auth.middleware";
import { authorizeRole } from "./middleware/role.middleware";
const router = express.Router();

// User Routes
router.post("/user/google-login", requireUserMiddleware, googleLogin);
router.get("/user/get-profile", requireUserMiddleware, getUserById);
router.post("/user/create-user", requireUserMiddleware, createUser);

// Event routes
router.post(
  "/event",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  createEvent
);
router.put(
  "/event/:id",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  editEvent
);
router.get("/event/:id", getEventById);
router.get("/event", getActiveEvents);
router.delete(
  "/event/:id",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  deleteEvent
);

// Application Routes

router.post("/application", requireUserMiddleware, createApplication);
router.put("/applicationnt/:id", requireUserMiddleware, updateApplication);
router.get("/event/:id", requireUserMiddleware, getApplication);
router.get("/events", requireUserMiddleware, getMyApplications);
router.delete("/event/:id", requireUserMiddleware, deleteApplication);

export default router;
