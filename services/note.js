// import models
const Note = require("../models/Note");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

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

const updateNote = async (userId, noteId, updatedNoteData) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        return generateResponseData(
            "error",
            "Cannot update the note, user does not exist"
        );
    }
    const oldNote = await Note.findById(noteId);
    console.log("old note: " + oldNote);
    if (!oldNote) {
        return generateResponseData(
            "error",
            "Cannot update the note, note does not exist"
        );
    }

    if (oldNote.user.toString() !== userId) {
        return generateResponseData(
            "error",
            "You cannot update the note. This note doesn't belong to you."
        );
    }

    oldNote.title = updatedNoteData.title; // i will build the front end so that title and description is always sent.
    oldNote.description = updatedNoteData.description;
    if (updatedNoteData.tag) {
        oldNote.tag = updatedNoteData.tag;
    }

    const note = await oldNote.save();

    return generateResponseData("success", "Note updated successfully", {
        note: note,
    });
};

module.exports = { fetchAll, addNote, updateNote };
