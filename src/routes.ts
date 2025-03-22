import express from "express";
import requireUserMiddleware from "./middleware/auth.middleware";
import { getUserById, googleLogin } from "./controller/user.controller";
import { authorizeRole } from "./middleware/role.middleware";
import { UserRole } from "./lib/constants";
import {
  createEvent,
  deleteEvent,
  editEvent,
  getActiveEvents,
  getEventById,
} from "./controller/event.controller";
import {
  createApplication,
  deleteApplication,
  getApplication,
  updateApplication,
} from "./controller/application.controller";
const router = express.Router();

// User Routes
router.post("/user/google-login", requireUserMiddleware, googleLogin);
router.get("/user/get-profile", requireUserMiddleware, getUserById);

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
router.delete("/event/:id", requireUserMiddleware, deleteApplication);

export default router;
