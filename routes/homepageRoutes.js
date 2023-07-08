import express from "express";
import { getHomepage } from "../controllers/homepageController.js";
// import {  getAntennas  } from "../controllers/antennaController.js";

// créer la route, l'initialiser
const router = express.Router();

router.get("/", getHomepage);
// router.get("/", getAntennas);

//exporter la logique
export default router;