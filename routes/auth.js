const express = require("express");
const { body, validationResult } = require("express-validator");

// importing authentication service
const authService = require("../services/auth");

// import the middleware
const { fetchuser } = require("../middlewares/fetchuser");

// instantiating the router
const router = express.Router();

// create a user using POST, doesn't require auth or login
const userValidator = [
    body(
        "name",
        "Please enter a valid name with 3 or more characters"
    ).isLength({ min: 3 }),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password length should be 5 or more characters").isLength(
        { min: 5 }
    ),
];
router.post("/createuser", userValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if there are any errors then send bad status.
        return res.status(400).json({ errors: errors.array() });
    }
    // create a new user
    try {
        const authToken = await authService.createUser(req.body, res);
        const responseData = {
            status: 200,
            msg: "User created successfully",
            data: {
                auth_token: authToken,
            },
        };
        return res.status(200).json(responseData);
    } catch (error) {
        console.log(error);
        res.status(error.errors[0].status).json(error);
    }
});

// authenticate a user using POST, doesn't require auth or login
const loginValidator = [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
];
router.post("/login", loginValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if there are any errors then send bad status.
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const authToken = await authService.login(req.body);
        const responseData = {
            status: 200,
            msg: "User logged in successfully",
            data: { auth_token: authToken },
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

// get the logged in user, login required
router.post("/getuser", fetchuser, async (req, res) => {
    const userId = req.user.id; // appended using middleware fetuser
    try {
        const user = await authService.getUser(userId);
        const responseData = {
            status: 200,
            msg: "Userfetched successfully",
            data: { user: user },
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

module.exports = router;
