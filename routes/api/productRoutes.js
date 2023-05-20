import express from "express";
import { 
    apiPostProduct,
    apiUpdateProduct,
    apiDeleteProduct,
    apiGetProducts, 
    apiGetProduct
} from "../../controllers/api/productController.js";

const router = express.Router();

router.post("/api/create-product", apiPostProduct);
router.get("/api/products", apiGetProducts);
router.patch("/api/update-product", apiUpdateProduct);
router.get("/api/product/:productId", apiGetProduct);
router.delete("/api/delete-product/:productId", apiDeleteProduct);

export default router;