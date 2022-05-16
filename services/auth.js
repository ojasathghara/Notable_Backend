const User = require("../models/User");

const generateResponseObj = (type, message) => {
    return { type: type, message: message };
};

const createUser = async (newUserData) => {
    try {
        let user = await User.findOne({ email: newUserData.email }); // finding a user in the Users table
        if (user) {
            return generateResponseObj("error", "Email already registered");
        } else {
            user = await User.create(newUserData);
            return generateResponseObj("success", "User created successfully");
        }
    } catch (error) {
        console.log(error.message);
        return generateResponseObj("fault", "database fault");
    }
};

module.exports = { createUser };
