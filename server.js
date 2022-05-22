const express = require("express");
const connectToMongo = require("./database/db");
const cors = require("cors");

// initial setup
connectToMongo();
const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 17778;
// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/note", require("./routes/note"));
app.use("/api/tag", require("./routes/tag"));

app.get("/", (req, res) => {
    res.send("You hav reached notable api url");
});

// server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
