const express = require("express");
const connectToMongo = require("./database/db");

// initial setup
connectToMongo();
const app = express();
app.use(express.json());

const port = process.env.PORT || 16500;

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));

const { setResponse } = require("./utilities/respond");
app.get("/", (req, res) => {
    res = setResponse(res, 200, { type: "success", message: "url fetched" });
    res.send();
});

// server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
