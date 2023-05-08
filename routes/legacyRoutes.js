import express from "express";
import { getLegacy } from "../controllers/legacyController.js";

const router = express.Router();

router.get("/legacy", getLegacy);

export default router;