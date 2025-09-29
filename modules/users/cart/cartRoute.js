import express from "express";
import {
    addToCart,
    removeProduct,
    checkout,
    removeCart
} from "./cartController.js";

const router = express.Router();


router
    .route("/")
    .patch(addToCart)
    .put(removeProduct)
    .delete(removeCart)

router.post("/checkout", checkout);

export { router as cartRouter };
