// import models
const Note = require("../models/Note");
const User = require("../models/User");

// import utils
const { generateResponseData } = require("../utilities/responseData");

const fetchAll = async (userId) => {
    try {
        const notes = await Note.find({ user: userId });
        return generateResponseData(
            "success",
            `fetched ${notes.length} notes`,
            {
                notes: notes,
            }
        );
    } catch (error) {
        console.log(error.message);
        return generateResponseData("fault", "Internal server error", {
            error: error.message,
        });
    }
};

const addNote = async (userId, newNoteData) => {
    try {
        const user = await User.findById(userId).select("-password"); // select all fields instead of the password
        if (!user) {
            return generateResponseData(
                "error",
                "Cannot create the note, user does not exist"
            );
        }

        const userIdObj = user._id;
        const note = await Note.create({
            user: userIdObj,
            title: newNoteData.title,
            description: newNoteData.description,
            tag: newNoteData.tag,
        });

        return generateResponseData("success", "Note created", {
            note: note,
        });
    } catch (error) {
        console.log(error.message);
        return generateResponseData("fault", "Internal server error", {
            error: error.message,
        });
    }
};

module.exports = { fetchAll, addNote };
