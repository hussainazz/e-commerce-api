import express from "express";
import { addProduct, updateProduct, deleteProduct } from "./adminController.js";

const router = express.Router();

router.post("/", addProduct);
router.patch("/:productId", updateProduct);
router.delete("/:productId", deleteProduct);

export { router as adminRouter };