import express from "express";
import { 
    login,
    signup,
    logout,
    userAccount
  } from "../controllers/userController.js";
 
  import {
    isAuthenticated,
    authorize
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/login", isAuthenticated, login);
router.post("/login", login);
router.get("/signup", isAuthenticated, signup);
router.post("/signup", signup);
router.get('/logout', logout);
router.get('/user-account', authorize, userAccount);

export default router;