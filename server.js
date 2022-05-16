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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
