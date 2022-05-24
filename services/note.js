// import models
const Note = require("../models/Note");
const User = require("../models/User");

const fetchAll = async (userId) => {
    const notes = await Note.find({ user: userId });
    return notes;
};

const addNote = async (userId, newNoteData) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        throw {
            errors: [
                {
                    value: password,
                    status: 401,
                    msg: "Please login using correct credentials",
                    param: "password",
                    location: "body",
                },
            ],
        };
    }

    const userIdObj = user._id;
    const note = await Note.create({
        user: userIdObj,
        title: newNoteData.title,
        description: newNoteData.description,
        tag: newNoteData.tag,
    });

    return note;
};

const updateNote = async (userId, noteId, updatedNoteData) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        throw {
            errors: [
                {
                    value: password,
                    status: 401,
                    msg: "Please login using correct credentials",
                    param: "password",
                    location: "body",
                },
            ],
        };
    }
    const oldNote = await Note.findById(noteId);
    if (!oldNote) {
        throw {
            errors: [
                {
                    value: email,
                    status: 404,
                    msg: "Note not found",
                    param: "email",
                    location: "body",
                },
            ],
        };
    }

    if (oldNote.user.toString() !== userId) {
        throw {
            errors: [
                {
                    value: password,
                    status: 401,
                    msg: "Please login using correct credentials",
                    param: "password",
                    location: "body",
                },
            ],
        };
    }

    oldNote.title = updatedNoteData.title; // i will build the front end so that title and description is always sent.
    oldNote.description = updatedNoteData.description;
    if (updatedNoteData.tag) {
        oldNote.tag = updatedNoteData.tag;
    }

    const note = await oldNote.save();
    return note;
};

const deleteNote = async (userId, noteId) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        throw {
            errors: [
                {
                    value: password,
                    status: 401,
                    msg: "Please login using correct credentials",
                    param: "password",
                    location: "body",
                },
            ],
        };
    }
    const oldNote = await Note.findById(noteId);
    if (!oldNote) {
        throw {
            errors: [
                {
                    value: email,
                    status: 404,
                    msg: "Note not found",
                    param: "email",
                    location: "body",
                },
            ],
        };
    }

    if (oldNote.user.toString() !== userId) {
        throw {
            errors: [
                {
                    value: password,
                    status: 401,
                    msg: "Please login using correct credentials",
                    param: "password",
                    location: "body",
                },
            ],
        };
    }

    const note = await Note.findByIdAndDelete(noteId);

    return note._id;
};

module.exports = { fetchAll, addNote, updateNote, deleteNote };
