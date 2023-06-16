import express from "express";
import { 
    getAntennas,  
    getAntenna
} from "../controllers/antennaController.js";

const router = express.Router();

router.get("/antennas", getAntennas);
// router.get("/antenna/:antennaId", getAntenna);
router.get("/antenna/:antennaSlug", getAntenna);

export default router;