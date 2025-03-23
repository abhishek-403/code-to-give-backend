import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplication,
  getMyActiveApplications,
  getMyApplications,
  updateApplication,
} from "./controller/application.controller";
import {
  createBulkEvent,
  createEvent,
  createVolunteeringDomain,
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
router.post(
  "/event-bulk",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  createBulkEvent
);
router.post(
  "/event-volunteering-domain",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  createVolunteeringDomain
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
router.get("/application", requireUserMiddleware, getMyActiveApplications);
router.put("/applicationnt/:id", requireUserMiddleware, updateApplication);
router.get("/event/:id", requireUserMiddleware, getApplication);
router.delete("/event/:id", requireUserMiddleware, deleteApplication);

export default router;
