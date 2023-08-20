import express from "express";
import { 
    getAntennas,  
    getAntenna
} from "../controllers/antennaController.js";

import { 
    getAntennas as getAdminAntennas,  
    getAntenna as getAdminAntenna,
    postAntenna,
    ajaxPostAntenna,
    deleteAntenna,
    updateAntenna,
    ajaxUpdateAntenna,
    ajaxUpdateNbSessionsInAntenna,
} from "../controllers/antennaAdminController.js";

import {
    adminIsAuthenticated,
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/antennas", isAuthenticated, getAntennas);
// router.get("/antenna/:antennaId", isAuthenticated, getAntenna);
router.get("/antenna/:antennaSlug", isAuthenticated, getAntenna);

router.get("/admin/antennas", adminIsAuthenticated, getAdminAntennas);
router.get("/admin/antenna/:antennaSlug", adminIsAuthenticated, getAdminAntenna);
router.get("/admin/create-antenna", adminIsAuthenticated, postAntenna);
router.get("/admin/update-antenna/:antennaSlug", adminIsAuthenticated, updateAntenna);
//endpoint
router.get("/admin/delete-antenna/:antennaSlug", adminIsAuthenticated, deleteAntenna);
router.post("/admin/ajax-create-antenna", adminIsAuthenticated, ajaxPostAntenna);
router.post("/admin/ajax-update-antenna/", adminIsAuthenticated, ajaxUpdateAntenna);
router.get("/admin/update-count-sessions/:antennaId", adminIsAuthenticated, ajaxUpdateNbSessionsInAntenna);
// /admin/update-count-sessions/<%= antenna._id %> // compter le nb de session et d'étudiants dans une antenne

export default router;