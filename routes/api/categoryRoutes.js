import express from "express";
import { 
    apiPostCategory,
    apiUpdateCategory,
    apiDeleteCategory,
    apiGetCategories, 
    apiGetCategory
} from "../../controllers/api/categoryController.js";

const router = express.Router();

router.post("/api/create-category", apiPostCategory);
router.get("/api/categories", apiGetCategories);
router.get("/api/category/:categoryId", apiGetCategory);
router.patch("/api/update-category", apiUpdateCategory);
router.delete("/api/delete-category/:categoryId", apiDeleteCategory);

export default router;