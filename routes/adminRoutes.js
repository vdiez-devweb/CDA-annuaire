import express from "express";
import { dashboard } from "../controllers/admin/adminController.js";

const router = express.Router();

router.get("/admin", dashboard);

export default router;