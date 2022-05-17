const express = require("express");
const { body, validationResult } = require("express-validator");

// importing authentication service
const authService = require("../services/auth");

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
    } else {
        // create a new user
        let serviceResponse = await authService.createUser(req.body);
        console.log(serviceResponse);

        switch (serviceResponse.type) {
            case "error":
                return res.status(400).json(serviceResponse);
            case "success":
                return res.status(200).json(serviceResponse);
            case "fault":
                return res.status(400).json(serviceResponse);

            default:
                res.status(400).json({ error: "unknown error" });
        }
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
    } else {
        let serviceResponse = await authService.login(req.body);

        switch (serviceResponse.type) {
            case "error":
                return res.status(400).json(serviceResponse);
            case "success":
                return res.status(200).json(serviceResponse);
            case "fault":
                return res.status(400).json(serviceResponse);

            default:
                res.status(400).json({ error: "unknown error" });
        }
    }
});

module.exports = router;
