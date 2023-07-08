import express from "express";
import { 
    getSessions,  
    getSession
} from "../controllers/sessionController.js";
import { 
    getSessions as getAdminSessions,
    getSession as getAdminSession,
    deleteSession,
    postSession,
    ajaxPostSession,
    updateSession, 
    ajaxUpdateSession, 
} from "../controllers/sessionAdminController.js";
 
import {
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/sessions", getSessions);
router.get("/session/:sessionId", getSession);


router.get("/admin/session/:sessionId", isAuthenticated, getAdminSession);
router.get("/admin/sessions", isAuthenticated, getAdminSessions);
router.get("/admin/create-session", isAuthenticated, postSession);
router.get("/admin/create-session/:antennaSlug", isAuthenticated, postSession);
router.get("/admin/update-session/:sessionId", isAuthenticated, updateSession);

//endpoint
router.get("/admin/delete-session/:sessionId", isAuthenticated, deleteSession); 
router.get("/admin/delete-session/:antennaSlug/:sessionId", isAuthenticated, deleteSession); 
router.post("/admin/ajax-create-session", isAuthenticated, ajaxPostSession);
router.post("/admin/ajax-update-session/:sessionId", isAuthenticated, ajaxUpdateSession);
// admin/update-count-students-in-session/<%= session._id %> // compter le nb d'étudiants dans une session

export default router;