import express from "express";
import { 
    dashboard,
    getProducts,
    getCategory,
    postCategory,
    ajaxPostCategory
} from "../controllers/admin/adminController.js";

const router = express.Router();

router.get("/admin", dashboard); //pour l'instant dashboard affiche la liste des categories
router.get("/admin/categories", dashboard);
router.get("/admin/products", getProducts);
router.get("/admin/category/:categorySlug", getCategory);

router.get("/admin/create-category", postCategory);
router.post("/admin/ajax-create-category", ajaxPostCategory);


export default router;