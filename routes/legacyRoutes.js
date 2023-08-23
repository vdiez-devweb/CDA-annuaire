import express from "express";
import { getLegacy } from "../controllers/legacyController.js";
import {
    adminIsAuthenticated,
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/legacy", isAuthenticated, getLegacy);

export default router;