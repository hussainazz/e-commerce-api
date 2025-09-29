import Products from "../products/productsModel.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function authorization(req, next) {
    let token = req.cookies?.token;
    let { role } = jwt.verify(token, JWT_SECRET_KEY);
    if (role !== "admin") {
        let error = {
            message: "you're not the admin!",
            status: 401,
        };
        next(error);
        return false;
    }
    return true;
}

async function addProduct(req, res, next) {
    if (!authorization(req, res, next)) {
        return;
    }
    let title = req.body.title;
    let price = req.body.title;

    await Products.create({
        title,
        price,
    });
    res.status(200).json("product added successfully.");
}

async function updateProduct(req, res, next) {
    if (!authorization(req, res, next)) {
        return;
    }
    let productId = req.params.productId;
    let productTitle = req.body.title;
    let productPrice = req.body.price;
    const product = await Products.findOne({
        where: { id: productId },
    });

    if (product === null) {
        let error = {
            message: "Product not found.",
            status: 404,
        };
        return next(error);
    }

    product.title = productTitle;
    product.price = productPrice;
    await product.save();
    res.status(200).json("product updated");
}

async function deleteProduct(req, res, next) {
    if (!authorization(req, next)) {
        return;
    }
    let productId = req.params.productId;
    const product = await Products.findOne({
        where: { id: productId },
    });
    if (product === null) {
        let error = {
            message: "Product not found.",
            status: 404,
        };
        return next(error);
    }
    await product.destroy();
    res.status(200).json("product deleted");
}

export { addProduct, updateProduct, deleteProduct };
