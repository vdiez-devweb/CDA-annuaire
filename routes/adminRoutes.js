import express from "express";
import { 
    login,
    auth,
    logout,
    dashboard,
    getProducts,
    getCategory,
    postCategory,
    ajaxPostCategory,
    deleteCategory,
    deleteProduct,
    postProduct,
    ajaxPostProduct,

} from "../controllers/admin/adminController.js";


const router = express.Router();

// middleware to test if authenticated
function isAuthenticated (req, res, next) {
    //console.log(req.session);
    if (req.session.user) next()
    else res.redirect("/admin/login/")
  }

  router.get("/admin/login", login);
  router.post("/admin/auth", auth);
  router.get("/admin/logout", logout);
  
router.get("/admin", isAuthenticated, dashboard); //pour l'instant dashboard affiche la liste des categories
router.get("/admin/categories", isAuthenticated, dashboard);
router.get("/admin/products", isAuthenticated, getProducts);
router.get("/admin/category/:categorySlug", isAuthenticated, getCategory);

router.get("/admin/create-category", isAuthenticated, postCategory);
router.post("/admin/ajax-create-category", isAuthenticated, ajaxPostCategory);
router.get("/admin/delete-category/:categorySlug", isAuthenticated, deleteCategory);
router.get("/admin/delete-product/:productId", isAuthenticated, deleteProduct); 
router.get("/admin/delete-product/:categorySlug/:productId", isAuthenticated, deleteProduct); 
router.get("/admin/create-product", isAuthenticated, postProduct);
router.get("/admin/create-product/:categorySlug", isAuthenticated, postProduct);
router.post("/admin/ajax-create-product", isAuthenticated, ajaxPostProduct);


export default router;