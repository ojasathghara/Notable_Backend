// import models
const Note = require("../models/Note");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

// import utils
const { setResponse } = require("../utilities/respond");

const fetchAll = async (userId, res) => {
    try {
        const notes = await Note.find({ user: userId });
        return setResponse(
            res,
            200,
            "success",
            `fetched ${notes.length} notes`,
            {
                notes: notes,
            }
        );
    } catch (error) {
        console.log(error.message);
        return setResponse(res, 400, "fault", "Internal server error", {
            error: error.message,
        });
    }
};

const addNote = async (userId, newNoteData, res) => {
    try {
        const user = await User.findById(userId).select("-password"); // select all fields instead of the password
        if (!user) {
            return setResponse(
                res,
                400,
                "error",
                "Cannot create the note, user not found"
            );
        }

        const userIdObj = user._id;
        const note = await Note.create({
            user: userIdObj,
            title: newNoteData.title,
            description: newNoteData.description,
            tag: newNoteData.tag,
        });

        return setResponse(res, 200, "success", "Note created", {
            note: note,
        });
    } catch (error) {
        console.log(error.message);
        return setResponse(res, 400, "fault", "Internal server error", {
            error: error.message,
        });
    }
};

const updateNote = async (userId, noteId, updatedNoteData, res) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        return setResponse(
            res,
            404,
            "error",
            "Cannot update the note, user not found"
        );
    }
    const oldNote = await Note.findById(noteId);
    console.log("old note: " + oldNote);
    if (!oldNote) {
        return setResponse(
            res,
            404,
            "error",
            "Cannot update the note, note not found"
        );
    }

    if (oldNote.user.toString() !== userId) {
        return setResponse(
            res,
            401,
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

    return setResponse(res, 200, "success", "Note updated successfully", {
        note: note,
    });
};

module.exports = { fetchAll, addNote, updateNote };
