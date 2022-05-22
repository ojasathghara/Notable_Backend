const jwt = require("jsonwebtoken");

// importing utilities

const JWT_SECRET = "DevelopedByOA"; // to verify the jwt token from my end.

const fetchuser = (req, res, next) => {
    // get the user from jwt token that sent when user logged in
    // add id to the request obj
    const token = req.header("auth_token"); // we will send the token key value pair with key as 'auth_token'
    console.log("token :" + token);
    if (!token) {
        return res.status(401).send({ error: "Unauthorized access" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log("fetchuser data: ");
        console.log(data);
        req.user = data.user; // added the user field to the request object
        next(); // now further process using the function in which this middleware is called
    } catch (error) {
        return res.status(401).send({ error: error.message });
    }
};

module.exports = { fetchuser };
