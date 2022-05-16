const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/notable";
const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("[Success] - Mongoose:\tConnected to MongoDB.");
    });
};

module.exports = connectToMongo;
