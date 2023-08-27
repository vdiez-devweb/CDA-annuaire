import express from "express";
import { 
    login,
    signup,
    logout,
    userAccount
  } from "../controllers/userController.js";
 
  import {
    isAuthenticated,
    authorize,
    authorizeAdmin
  } from "../middlewares/auth.js";

  import { 
    dashboard,
  } from "../controllers/adminController.js";

const router = express.Router();

router.get("/login", isAuthenticated, login);
router.post("/login", isAuthenticated, login);
router.get("/signup", isAuthenticated, signup);
router.post("/signup", isAuthenticated, signup);
router.get('/logout', isAuthenticated, logout);
router.get('/user-account', authorize, userAccount);
router.get("/admin", authorizeAdmin, dashboard); //pour l'instant dashboard affiche la liste des centres de formation

export default router;