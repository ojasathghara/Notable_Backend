const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "DevelopedByOA"; // to sign the jwt token from my end.

const generateResponseObj = (type, message, extras = {}) => {
    return { type: type, message: message, extras: extras };
};

const createUser = async (newUserData) => {
    try {
        let user = await User.findOne({ email: newUserData.email }); // finding a user in the Users table
        if (user) {
            return generateResponseObj("error", "Email already registered", {});
        } else {
            // first change the password to a secure password.
            const salt = await bcrypt.genSalt(10); // generate a 10 character salt
            const secPassword = await bcrypt.hash(newUserData.password, salt);
            newUserData.password = secPassword;

            user = await User.create(newUserData); // user created by mongo db will have all db feilds such as id and all
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            const extra = {
                token: authToken,
            };

            return generateResponseObj(
                "success",
                "User created successfully",
                extra
            );
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseObj("fault", "database fault", {});
    }
};

const login = async (userData) => {
    try {
        const { email, password } = userData; // destructuring the json body
        // retrieves the user from the database
        let user = await User.findOne({ email: email }).lean(true);
        if (!user) {
            return generateResponseObj(
                "error",
                "Please login using correct credentials",
                {}
            );
        }

        // compare the given password and stored password.
        console.log("user: " + user);
        console.log("password: " + password);
        console.log("hash: " + user.password);

        const passwordCompare = await bcrypt.compare(password, user.password);
        console.log("compare result: " + passwordCompare);

        if (!passwordCompare) {
            return generateResponseObj(
                "error",
                "Please login using correct credentials"
            );
        } else {
            const data = {
                user: {
                    id: user.id,
                },
            };
            const authToken = jwt.sign(data, JWT_SECRET);
            const extra = {
                token: authToken,
            };
            return generateResponseObj("success", "User authenticated", extra);
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseObj("fault", "database fault");
    }
};

module.exports = { createUser, login };
