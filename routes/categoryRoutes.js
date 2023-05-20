import express from "express";
import { 
    getCategories,  
    getCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/categories", getCategories);
// router.get("/category/:categoryId", getCategory);
router.get("/category/:categorySlug", getCategory);

export default router;