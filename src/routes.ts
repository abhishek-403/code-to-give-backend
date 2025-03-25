import express from "express";
import {
  createApplication,
  deleteApplication,
  getApplication,
  getMyActiveApplications,
  updateApplication,
  updateApplicationStatus,
} from "./controller/application.controller";
import {
  addTaskToEvent,
  createEvent,
  createVolunteeringDomain,
  deleteEvent,
  editEvent,
  getActiveEvents,
  getActiveEventsAdmin,
  getAllTemplates,
  getEventById,
  getVolunteerSideEventHistory,
  getVolunteerSideEventInfo,
  getVolunteeringDomain,
  updateTaskStatusByVolunteeer,
  volunteerSubmitFeedback,
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
// router.post(
//   "/event-bulk",
//   requireUserMiddleware,
//   authorizeRole(UserRole.WEBMASTER),
//   createBulkEvent
// );
router.post(
  "/event-volunteering-domain",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  createVolunteeringDomain
);
router.get("/event-volunteering-domain", getVolunteeringDomain);
router.put(
  "/event/:id",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  editEvent
);
router.get("/event/:id", getEventById);
router.get("/event-templates", getAllTemplates);
router.get("/event", getActiveEvents);
router.get(
  "/volunteer/event/:eventId",
  requireUserMiddleware,
  getVolunteerSideEventInfo
);
router.get(
  "/volunteer/event-history",
  requireUserMiddleware,
  getVolunteerSideEventHistory
);
router.post(
  "/volunteer/event-feedback",
  requireUserMiddleware,
  volunteerSubmitFeedback
);
router.get(
  "/event-admin",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  getActiveEventsAdmin
);
router.post(
  "/event/:eventId/task",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  addTaskToEvent
);
router.post(
  "/volunteer/event/task/:taskId",
  requireUserMiddleware,
  updateTaskStatusByVolunteeer
);
router.delete(
  "/event/:id",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  deleteEvent
);

// Application Routes

router.post("/application", requireUserMiddleware, createApplication);
router.post(
  "/application/:id/status",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  updateApplicationStatus
);
router.get("/application", requireUserMiddleware, getMyActiveApplications);
router.put(
  "/application/:id",
  authorizeRole(UserRole.WEBMASTER),
  updateApplication
);
router.get("/event/:id", requireUserMiddleware, getApplication);
router.delete(
  "/event/:id",
  requireUserMiddleware,
  authorizeRole(UserRole.WEBMASTER),
  deleteApplication
);

export default router;
