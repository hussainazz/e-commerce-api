import express from "express";
import { renderAllProducts, renderOneProduct } from "./productsController.js";

const router = express.Router();

router.get("/", (req, res, next) => {
    let productId = req.query.productId;
    if (productId) {
        return renderOneProduct(req, res, next, productId);
    }
    renderAllProducts(req, res);
});

export { router as productsRouter };
