import express from "express";
import { configDotenv } from "dotenv";
import sequelize from "../config/db.js";
import { auth } from "../modules/auth/authRoute.js";
import jwtAuth from "../middlewares/jwtMiddleware.js";
import { productsRouter } from "../modules/products/productsRoute.js";
import { adminRouter } from "../modules/admin/adminRoute.js";
import { cartRouter } from "../modules/users/cart/cartRoute.js";
import errorHandler from "../middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

configDotenv();
const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(jwtAuth);

app.use("/api/products", productsRouter);
app.use("/api/admin/products", adminRouter);
app.use("/api/auth", auth, jwtAuth);
app.use("/api/carts", cartRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`listening on: ${port}`);
});

// GET /products
// GET /products/:productId

// PATCH /cart add product to cart
// DELETE /cart remove product from cart
// POST /cart/checkout
// POST /cart/payment

// POST /auth/signup
// POST /auth/login

// POST /admin/products insert product
// PATCH /admin/products/:productId update product
// DELETE /admin/products/:productId remove product

await sequelize.sync();
