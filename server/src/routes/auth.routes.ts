import { Router } from "express";

import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin,
} from "../controllers/auth.controller";

import { requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/login",
  loginAdmin,
);

router.get(
  "/me",
  requireAdmin,
  getCurrentAdmin,
);

router.post(
  "/logout",
  requireAdmin,
  logoutAdmin,
);

export default router;