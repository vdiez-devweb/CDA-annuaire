import express from "express";
import { 
    apiPostAntenna,
    apiUpdateAntenna,
    apiDeleteAntenna,
    apiGetAntennas, 
    apiGetAntenna
} from "../../controllers/api/antennaController.js";

const router = express.Router();

router.post("/api/create-antenna", apiPostAntenna);
router.get("/api/antennas", apiGetAntennas);
router.get("/api/antenna/:antennaId", apiGetAntenna);
router.patch("/api/update-antenna", apiUpdateAntenna);
router.delete("/api/delete-antenna/:antennaId", apiDeleteAntenna);

export default router;