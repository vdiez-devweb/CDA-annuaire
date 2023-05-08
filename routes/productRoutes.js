import express from "express";
import { 
    apiPostProduct,
    apiUpdateProduct,
    apiDeleteProduct,
    apiGetProducts, 
    apiGetProduct,
    getProducts,  
    getProduct, 
    // deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

/* endpoints api*/
router.post("/api/create-product", apiPostProduct);
router.get("/api/products", apiGetProducts);
router.patch("/api/update-product", apiUpdateProduct);
router.get("/api/product/:productId", apiGetProduct);
router.delete("/api/delete-product/:productId", apiDeleteProduct);
/* routes webApp */
router.get("/products", getProducts);
router.get("/product/:productId", getProduct);
// router.get("/delete-product/:productId", deleteProduct); //! ne passe pas si router.delete()


export default router;