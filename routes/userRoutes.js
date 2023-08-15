import express from "express";
import { 
    login,
    signup,
  } from "../controllers/userController.js";
 
  // import {
  //   isAuthenticated
  // } from "../middlewares/auth.js";

const router = express.Router();

router.get("/login", login);
router.post("/login", login);
router.get("/signup", signup);
router.post("/signup", signup);

export default router;