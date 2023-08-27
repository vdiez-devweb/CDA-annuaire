import express from "express";
import { 
    getAntennas,  
    getAntenna
} from "../controllers/antennaController.js";

import { 
    getAntennas as getAdminAntennas,  
    getAntenna as getAdminAntenna,
    postAntenna,
    deleteAntenna,
    updateAntenna,
    // ajaxUpdateAntenna,
    ajaxUpdateNbSessionsInAntenna,
} from "../controllers/antennaAdminController.js";

import {
    authorizeAdmin,
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/antennas", isAuthenticated, getAntennas);
// router.get("/antenna/:antennaId", isAuthenticated, getAntenna);
router.get("/antenna/:antennaSlug", isAuthenticated, getAntenna);

router.get("/admin/antennas", authorizeAdmin, getAdminAntennas);
router.get("/admin/antenna/:antennaSlug", authorizeAdmin, getAdminAntenna);
router.get("/admin/create-antenna", authorizeAdmin, postAntenna);
router.post("/admin/create-antenna", authorizeAdmin, postAntenna);
router.get("/admin/update-antenna/:antennaSlug", authorizeAdmin, updateAntenna);
router.get("/admin/update-antenna/", authorizeAdmin, updateAntenna);
router.post("/admin/update-antenna/", authorizeAdmin, updateAntenna);
//endpoint
router.get("/admin/delete-antenna/:antennaSlug", authorizeAdmin, deleteAntenna);
router.get("/admin/update-count-sessions/:antennaId", authorizeAdmin, ajaxUpdateNbSessionsInAntenna);
// /admin/update-count-sessions/<%= antenna._id %> // compter le nb de session et d'étudiants dans une antenne

export default router;