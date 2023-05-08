import express from "express";
import { 
    dashboard,
    getProducts,
    getCategory,
    // PostCategory
} from "../controllers/admin/adminController.js";

const router = express.Router();

router.get("/admin", dashboard); //pour l'instant dashboard affiche la liste des categories
router.get("/admin/categories", dashboard);
router.get("/admin/products", getProducts);
router.get("/admin/category/:categorySlug", getCategory);

// router.post("/admin/create-category", PostCategory);


export default router;