import Carts from "./cartModel.js";
import Products from "../../products/productsModel.js";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import Stripe from "stripe";

configDotenv();
const stripe = Stripe(process.env.STRIPE_KEY);

async function addToCart(req, res, next) {
    let productId = req.body?.productId;
    let payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    let userId = payload.userId;

    if (!productId) {
        let error = { status: 400, message: "product id must be provided." };
        return next(error);
    }
    const product = await Products.findOne({
        where: { id: productId },
    });
    if (product == null) {
        let err = { message: "Product not found", status: 404 };
        return next(err);
    }
    const userCarts = await Carts.findAll({ where: { user_id: userId } });

    const prodAlreadyAdded =
        userCarts.length > 0
            ? userCarts.find((prod) => prod.dataValues.product_id == productId)
            : "";
    if (prodAlreadyAdded) {
        let quantity = prodAlreadyAdded.dataValues.quantity;
        let id = prodAlreadyAdded.dataValues.id;
        quantity++;
        await Carts.update({ quantity }, { where: { id } });
    } else {
        await Carts.create({
            user_id: userId,
            product_id: productId,
            quantity: 1,
        });
    }
    res.status(200).send("product added to cart successfully.");
}

async function removeProduct(req, res, next) {
    let { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    const deletedCount = await Carts.destroy({
        where: {
            product_id: req.body.productId,
            user_id: userId,
        },
    });
    if (deletedCount === 0) {
        let error = {
            status: 404,
            message: "unable to find the product in the cart",
        };
        return next(error);
    }
    res.status(200).send("product deleted from cart successfully.");
}

async function removeCart(req, res, next) {
    let { userId } = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    const deletedCount = await Carts.destroy({ where: { user_id: userId } });
    if (deletedCount === 0) {
        let error = {
            status: 404,
            message: "unable to find any cart for the user",
        };
        return next(error);
    }
    res.status(200).json("carts deleted successfully");
}

async function checkout(req, res, next) {
    let products = [];
    let { userId } = jwt.verify(req.cookies.token, JWT_SECRET_KEY);
    const carts = await Carts.findAll({ where: { user_id: userId } });
    if (carts.length === 0) {
        let error = {
            status: 404,
            message: "unable to find any cart",
        };
        return next(error);
    }
    const product_id_s = carts.map((cart) => cart.dataValues.product_id);
    for (let id of product_id_s) {
        const product = await Products.findOne({ where: { id } });
        products.push(product.dataValues);
    }
    const stripeSession = await stripe.checkout.sessions.create({
        line_items: products.map((prod) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: prod.title,
                    },
                    unit_amount: Math.round(prod.price) * 10,
                },
                quantity: carts.find(
                    (cart) => cart.dataValues.product_id == prod.id
                ).quantity,
            };
        }),
        mode: "payment",
        success_url: `${process.env.ORIGIN_DOMAIN}`,
        cancel_url: `${process.env.ORIGIN_DOMAIN}`,
    });
    res.redirect(303, stripeSession.url);
}

export { addToCart, removeProduct, checkout, removeCart };
