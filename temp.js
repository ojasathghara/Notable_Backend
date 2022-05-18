const jwt = require("jsonwebtoken");

JWT_SECRET = "DevelopedByOA";

const data = {
    user: {
        id: "62832f99f505102663419aed",
    },
};
const authToken = jwt.sign(data, JWT_SECRET);

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7fSwiaWF0IjoxNjUyNzg1MzgxfQ.oOk0n7uBs0N9Gfm7j8OUEXk8aNmcAgN0hslpDQuwiQk";

console.log(jwt.verify(authToken, JWT_SECRET));
