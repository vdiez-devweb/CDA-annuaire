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
    adminIsAuthenticated, 
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/sessions", isAuthenticated, getSessions);
router.get("/session/:sessionId", isAuthenticated, getSession);


router.get("/admin/session/:sessionId", adminIsAuthenticated, getAdminSession);
router.get("/admin/sessions", adminIsAuthenticated, getAdminSessions);
router.get("/admin/create-session", adminIsAuthenticated, postSession);
router.get("/admin/create-session/:antennaSlug", adminIsAuthenticated, postSession);
router.get("/admin/update-session/:sessionId", adminIsAuthenticated, updateSession);
router.get("/admin/update-session/", adminIsAuthenticated, updateSession);

//endpoint
router.get("/admin/delete-session/:sessionId", adminIsAuthenticated, deleteSession); 
router.get("/admin/delete-session/:antennaSlug/:sessionId", adminIsAuthenticated, deleteSession); 
router.post("/admin/ajax-create-session", adminIsAuthenticated, ajaxPostSession);
// router.post("/admin/ajax-update-session/:sessionId", adminIsAuthenticated, ajaxUpdateSession);
router.post("/admin/ajax-update-session", adminIsAuthenticated, ajaxUpdateSession);
// admin/update-count-students-in-session/<%= session._id %> // compter le nb d'étudiants dans une session

export default router;