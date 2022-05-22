const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "DevelopedByOA"; // to sign the jwt token from my end.

const createUser = async (newUserData) => {
    let user = await User.findOne({ email: newUserData.email }); // finding a user in the Users table
    if (user) {
        throw { type: 402, message: "User already exists" };
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
    return authToken;
};

const login = async (userData) => {
    const { email, password } = userData; // destructuring the json body
    // retrieves the user from the database
    let user = await User.findOne({ email: email });
    if (!user) {
        throw { type: 404, message: "User not found" };
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw { type: 401, message: "Please login using correct credentials" };
    }
    // this data is decoded by jwt using jwt.verify
    const data = {
        user: {
            id: user._id,
        },
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    return authToken;
};

const getUser = async (userId) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        throw { type: 404, message: "User not found" };
    }
    return user;
};

module.exports = { createUser, login, getUser };
