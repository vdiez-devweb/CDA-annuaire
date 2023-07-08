import express from "express";
import { 
    login,
    auth,
    logout,
    dashboard,
  } from "../controllers/adminController.js";
 
  import {
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/admin/login", login);
router.post("/admin/auth", auth);
router.get("/admin/logout", logout);
router.get("/admin", isAuthenticated, dashboard); //pour l'instant dashboard affiche la liste des centres de formation

export default router;