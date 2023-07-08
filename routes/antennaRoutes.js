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
    isAuthenticated
  } from "../middlewares/auth.js";

const router = express.Router();

router.get("/antennas", getAntennas);
// router.get("/antenna/:antennaId", getAntenna);
router.get("/antenna/:antennaSlug", getAntenna);

router.get("/admin/antennas", isAuthenticated, getAdminAntennas);
router.get("/admin/antenna/:antennaSlug", isAuthenticated, getAdminAntenna);
router.get("/admin/create-antenna", isAuthenticated, postAntenna);
router.get("/admin/update-antenna/:antennaSlug", isAuthenticated, updateAntenna);
//endpoint
router.get("/admin/delete-antenna/:antennaSlug", isAuthenticated, deleteAntenna);
router.post("/admin/ajax-create-antenna", isAuthenticated, ajaxPostAntenna);
router.post("/admin/ajax-update-antenna/", isAuthenticated, ajaxUpdateAntenna);
router.get("/admin/update-count-sessions/:antennaId", isAuthenticated, ajaxUpdateNbSessionsInAntenna);
// /admin/update-count-sessions/<%= antenna._id %> // compter le nb de session et d'étudiants dans une antenne

export default router;