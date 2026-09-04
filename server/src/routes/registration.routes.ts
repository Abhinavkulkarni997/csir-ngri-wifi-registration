import { Router } from "express";

import {
  createRegistration,
    getRegistrations,
    updateRegistrationStatus,
    exportRegistrations,
} from "../controllers/registration.controller";

import {
  validateRegistration,
} from "../middleware/validateRegistration";
import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

/*
 * ============================================================
 * CREATE REGISTRATION
 * ============================================================
 *
 * POST /api/registrations
 *
 * Request flow:
 *
 * Request
 *   ↓
 * Validation
 *   ↓
 * Controller
 *   ↓
 * MongoDB
 *
 */

router.get(
  "/",
  requireAdmin,
  getRegistrations,
);

router.get(
  "/export",
  requireAdmin,
  exportRegistrations,
);


router.post(
  "/",
  validateRegistration,
  createRegistration,
);



router.patch(
  "/:id/status",
  requireAdmin,
  updateRegistrationStatus,
);

export default router;