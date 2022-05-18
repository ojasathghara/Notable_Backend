const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// importing utilities
const { generateResponseData } = require("../utilities/responseData");

const JWT_SECRET = "DevelopedByOA"; // to sign the jwt token from my end.

const createUser = async (newUserData) => {
    try {
        let user = await User.findOne({ email: newUserData.email }); // finding a user in the Users table
        if (user) {
            return generateResponseData(
                "error",
                "Email already registered",
                {}
            );
        } else {
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

            return generateResponseData(
                "success",
                "User created successfully",
                extra
            );
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseData("fault", "database fault", {
            error: error.message,
        });
    }
};

const login = async (userData) => {
    try {
        const { email, password } = userData; // destructuring the json body
        // retrieves the user from the database
        let user = await User.findOne({ email: email }).lean(true);
        if (!user) {
            return generateResponseData(
                "error",
                "Please login using correct credentials",
                {}
            );
        }

        // compare the given password and stored password.
        console.log("user id: " + user._id);
        console.log("password: " + password);
        console.log("hash: " + user.password);

        const passwordCompare = await bcrypt.compare(password, user.password);
        console.log("compare result: " + passwordCompare);

        if (!passwordCompare) {
            return generateResponseData(
                "error",
                "Please login using correct credentials"
            );
        } else {
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
            return generateResponseData("success", "User authenticated", extra);
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseData("fault", "database fault", {
            error: error.message,
        });
    }
};

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId).select("-password"); // select all fields instead of the password
        if (!user) {
            return generateResponseData("error", "User does not exist");
        } else {
            return generateResponseData("success", "User exists", {
                user: user,
            });
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseData("fault", "database fault", {
            error: error.message,
        });
    }
};

module.exports = { createUser, login, getUser };
