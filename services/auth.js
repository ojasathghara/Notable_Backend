const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// importing utilities
const { setResponse } = require("../utilities/respond");

const JWT_SECRET = "DevelopedByOA"; // to sign the jwt token from my end.

const createUser = async (newUserData, res) => {
    try {
        let user = await User.findOne({ email: newUserData.email }); // finding a user in the Users table
        if (user) {
            return setResponse(
                res,
                400,
                "error",
                "Email already registered",
                {}
            );
        }
        // first change the password to a secure password.
        const salt = await bcrypt.genSalt(10); // generate a 10 character salt
        const secPassword = await bcrypt.hash(newUserData.password, salt);
        newUserData.password = secPassword;

        user = await User.create(newUserData); // user created by mongo db will have all db feilds such as id and all
        // this data is decoded by jwt using jwt.verify
        const data = {
            user: {
                id: user._id,
            },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        const extra = {
            token: authToken,
        };

        return setResponse(
            res,
            200,
            "success",
            "User created successfully",
            extra
        );
    } catch (error) {
        console.log(error.message);
        return setResponse(res, 500, "fault", "Internal server error");
    }
};

const login = async (userData, res) => {
    try {
        const { email, password } = userData; // destructuring the json body
        // retrieves the user from the database
        let user = await User.findOne({ email: email });
        if (!user) {
            return setResponse(
                res,
                400,
                "error",
                "Please login using correct credentials",
                {}
            );
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return setResponse(
                res,
                400,
                "error",
                "Please login using correct credentials"
            );
        }
        // this data is decoded by jwt using jwt.verify
        const data = {
            user: {
                id: user._id,
            },
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        const extra = {
            token: authToken,
        };
        return setResponse(res, 200, "success", "User authenticated", extra);
    } catch (error) {
        console.log(error.message);
        return setResponse(res, 500, "fault", "Internal server error");
    }
};

const getUser = async (userId, res) => {
    try {
        const user = await User.findById(userId).select("-password"); // select all fields instead of the password
        if (!user) {
            return setResponse(res, 404, "error", "User not found");
        }
        return setResponse(res, 200, "success", "User exists", {
            user: user,
        });
    } catch (error) {
        console.log(error.message);
        return setResponse(res, 500, "fault", "Internal server error");
    }
};

module.exports = { createUser, login, getUser };
