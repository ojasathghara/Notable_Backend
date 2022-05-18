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
    res = await authService.createUser(req.body, res);
    res.send();
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
    res = await authService.login(req.body, res);
    res.send();
});

// get the logged in user, login required
router.post("/getuser", fetchuser, async (req, res) => {
    const userId = req.user.id; // appended using middleware fetuser
    res = await authService.getUser(userId, res);
    res.send();
});

module.exports = router;
