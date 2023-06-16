import express from "express";
import { 
    getSessions,  
    getSession
} from "../controllers/sessionController.js";

const router = express.Router();

router.get("/sessions", getSessions);
router.get("/session/:sessionId", getSession);

export default router;