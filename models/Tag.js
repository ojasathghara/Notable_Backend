const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
});

const Tag = mongoose.model("tag", TagSchema);
module.exports = Tag;
