import express from "express";
import { getHomepage } from "../controllers/homepageController.js";
// import {  getCategories  } from "../controllers/categoryController.js";

// créer la route, l'initialiser
const router = express.Router();

router.get("/", getHomepage);
// router.get("/", getCategories);


//exporter la logique
export default router;