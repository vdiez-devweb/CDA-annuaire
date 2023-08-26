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
    updateSession, 
    ajaxUpdateSession, 
} from "../controllers/sessionAdminController.js";
 
import {
    authorizeAdmin, 
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/sessions", isAuthenticated, getSessions);
router.get("/session/:sessionId", isAuthenticated, getSession);


router.get("/admin/session/:sessionId", authorizeAdmin, getAdminSession);
router.get("/admin/sessions", authorizeAdmin, getAdminSessions);
router.get("/admin/create-session", authorizeAdmin, postSession);
router.get("/admin/create-session/:antennaSlug", authorizeAdmin, postSession);
router.post("/admin/create-session", authorizeAdmin, postSession);
router.get("/admin/update-session/:sessionId", authorizeAdmin, updateSession);
router.get("/admin/update-session/", authorizeAdmin, updateSession);

//endpoint
router.get("/admin/delete-session/:sessionId", authorizeAdmin, deleteSession); 
router.get("/admin/delete-session/:antennaSlug/:sessionId", authorizeAdmin, deleteSession); 
// router.post("/admin/ajax-create-session", authorizeAdmin, ajaxPostSession);
// router.post("/admin/ajax-update-session/:sessionId", authorizeAdmin, ajaxUpdateSession);
router.post("/admin/ajax-update-session", authorizeAdmin, ajaxUpdateSession);
// admin/update-count-students-in-session/<%= session._id %> // compter le nb d'étudiants dans une session

export default router;