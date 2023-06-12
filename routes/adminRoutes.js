import express from "express";
import { 
    login,
    auth,
    logout,
    dashboard,
    getProducts,
    getCategory,
    getCategories,
    postCategory,
    ajaxPostCategory,
    deleteCategory,
    deleteProduct,
    postProduct,
    ajaxPostProduct,
    getProduct,
    updateProduct, 
    ajaxUpdateProduct, 
    updateCategory,
    ajaxUpdateCategory
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
router.get("/admin/categories", isAuthenticated, getCategories);
router.get("/admin/product/:productId", isAuthenticated, getProduct);
router.get("/admin/products", isAuthenticated, getProducts);
router.get("/admin/category/:categorySlug", isAuthenticated, getCategory);

router.get("/admin/create-category", isAuthenticated, postCategory);
router.get("/admin/delete-category/:categorySlug", isAuthenticated, deleteCategory);
router.get("/admin/delete-product/:productId", isAuthenticated, deleteProduct); 
router.get("/admin/delete-product/:categorySlug/:productId", isAuthenticated, deleteProduct); 
router.get("/admin/create-product", isAuthenticated, postProduct);
router.get("/admin/create-product/:categorySlug", isAuthenticated, postProduct);
router.get("/admin/update-product/:productId", isAuthenticated, updateProduct);
router.get("/admin/update-category/:categorySlug", isAuthenticated, updateCategory);

//endpoint
router.post("/admin/ajax-create-category", isAuthenticated, ajaxPostCategory);
router.post("/admin/ajax-create-product", isAuthenticated, ajaxPostProduct);
router.post("/admin/ajax-update-product/:productId", isAuthenticated, ajaxUpdateProduct);
router.post("/admin/ajax-update-category/", isAuthenticated, ajaxUpdateCategory);


export default router;