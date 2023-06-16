import express from "express";
import { 
    apiPostSession,
    apiUpdateSession,
    apiDeleteSession,
    apiGetSessions, 
    apiGetSession
} from "../../controllers/api/sessionController.js";

const router = express.Router();

router.post("/api/create-session", apiPostSession);
router.get("/api/sessions", apiGetSessions);
router.patch("/api/update-session", apiUpdateSession);
router.get("/api/session/:sessionId", apiGetSession);
router.delete("/api/delete-session/:sessionId", apiDeleteSession);

export default router;