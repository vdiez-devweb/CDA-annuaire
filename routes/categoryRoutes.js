import express from "express";
import { 
    apiPostCategory,
    apiUpdateCategory,
    apiDeleteCategory,
    apiGetCategories, 
    apiGetCategory,
    getCategories,  
    getCategory, 
    deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/* endpoints api*/
router.post("/api/create-category", apiPostCategory);
router.get("/api/categories", apiGetCategories);
router.get("/api/category/:categoryId", apiGetCategory);
router.patch("/api/update-category", apiUpdateCategory);
router.delete("/api/delete-category/:categoryId", apiDeleteCategory);
/* routes webApp */
router.get("/categories", getCategories);
// router.get("/category/:categoryId", getCategory);
router.get("/category/:categorySlug", getCategory);
router.get("/delete-category/:categoryId", deleteCategory);//! ne passe pas si router.delete()


export default router;