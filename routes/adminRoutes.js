import express from "express";
import { 
    login,
    auth,
    logout,
    dashboard,
    getSessions,
    getAntenna,
    getAntennas,
    postAntenna,
    ajaxPostAntenna,
    deleteAntenna,
    deleteSession,
    postSession,
    ajaxPostSession,
    getSession,
    updateSession, 
    ajaxUpdateSession, 
    updateAntenna,
    ajaxUpdateAntenna,
    ajaxUpdateNbSessionsInAntenna
} from "../controllers/admin/adminController.js";


const router = express.Router();

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
    //console.log(req.session);
    if (req.session.authenticated && req.session.user) next()
    else res.redirect("/admin/login/")
  }

  router.get("/admin/login", login);
  router.post("/admin/auth", auth);
  router.get("/admin/logout", logout);
  
router.get("/admin", isAuthenticated, dashboard); //pour l'instant dashboard affiche la liste des centres de formation
router.get("/admin/antennas", isAuthenticated, getAntennas);
router.get("/admin/session/:sessionId", isAuthenticated, getSession);
router.get("/admin/sessions", isAuthenticated, getSessions);
router.get("/admin/antenna/:antennaSlug", isAuthenticated, getAntenna);

router.get("/admin/create-antenna", isAuthenticated, postAntenna);
router.get("/admin/delete-antenna/:antennaSlug", isAuthenticated, deleteAntenna);
router.get("/admin/delete-session/:sessionId", isAuthenticated, deleteSession); 
router.get("/admin/delete-session/:antennaSlug/:sessionId", isAuthenticated, deleteSession); 
router.get("/admin/create-session", isAuthenticated, postSession);
router.get("/admin/create-session/:antennaSlug", isAuthenticated, postSession);
router.get("/admin/update-session/:sessionId", isAuthenticated, updateSession);
router.get("/admin/update-antenna/:antennaSlug", isAuthenticated, updateAntenna);

//endpoint
router.post("/admin/ajax-create-antenna", isAuthenticated, ajaxPostAntenna);
router.post("/admin/ajax-create-session", isAuthenticated, ajaxPostSession);
router.post("/admin/ajax-update-session/:sessionId", isAuthenticated, ajaxUpdateSession);
router.post("/admin/ajax-update-antenna/", isAuthenticated, ajaxUpdateAntenna);
router.get("/admin/update-count-sessions/:antennaId", isAuthenticated, ajaxUpdateNbSessionsInAntenna);



export default router;