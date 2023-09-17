import express from "express";
import { getHomepage } from "../controllers/homepageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

// créer la route, l'initialiser
const router = express.Router();

router.get("/", isAuthenticated, getHomepage);

//exporter la logique
export default router;