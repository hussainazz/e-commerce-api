import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function jwtAuth(req, res, next) {
    if (req.url === "/api/auth/signup" || req.url === "/api/auth/login") {
        if (req.params?.success !== true) {
            return next();
        }
    }
    let userId = req.cookieTempData?.userId;
    let role = req.cookieTempData?.role;
    let token = req.cookies?.token;
    console.log("token :", token);

    // if client isn't authorized
    if (!token && !req.cookieTempData) {
        let error = { status: 401, message: "unauthorized" };
        return next(error);
    }
    if (req.url === "/login" || req.url === "/signup") {
        const token = jwt.sign({ userId, role }, JWT_SECRET_KEY);
        res.status(201)
            .cookie("token", token)
            .json("authentication successful.");
    }
    next();
}

export default jwtAuth;
