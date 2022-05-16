const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("path: /api/note");
});

module.exports = router;
