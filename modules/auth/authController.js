import Users from "../users/usersModel.js";

async function signup(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username) {
        let err = {
            message: "username cannot be empty.",
            status: 400,
        };
        return next(err);
    }
    if (!password) {
        let err = {
            message: "Password cannot be empty.",
            status: 400,
        };
        return next(err);
    }
    try {
        const user = await Users.create({
            username,
            password,
        });
        req.cookieTempData = {
            userId: user.id,
            role: "user",
        };
    } catch (error) {
        throw new Error(error.original);
    }
    req.params.success = true;
    next()
}

async function login(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.AdMIN_PASSWORD
    ) {
        req.cookieTempData = {
            userId: 0,
            role: "admin",
        };
        req.params.success = true;
        return next();
    }

    const user = await Users.findOne({
        where: {
            username,
            password,
        },
    });
    if (!user) {
        let err = {};
        err.message = "Username or password is incorrect.";
        err.status = 404;
        return next(err);
    }
    req.cookieTempData = {
        userId: user.id,
        role: "user",
    };

    req.params.success = true;
    next();
}

export { signup, login };
