const express = require("express");
const { body, validationResult } = require("express-validator");

// import middleware
const { fetchuser } = require("../middlewares/fetchuser");

// import service
const noteService = require("../services/note");

// router
const router = express.Router();
// get all the notes
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    const userId = req.user.id; // appended using middleware fetuser

    try {
        const notes = await noteService.fetchAll(userId);
        const responseData = {
            data: {
                notes: notes,
            },
        };
        return res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

// add a new note
const noteValidator = [
    body("title", "Title cannot be empty").not().isEmpty(),
    body("description", "Please add a description").not().isEmpty(),
];
router.post("/addnote", fetchuser, noteValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if there are any errors then send bad status.
        return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const newNoteData = {
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
    };

    try {
        const note = await noteService.addNote(userId, newNoteData);
        const responseData = {
            data: {
                note: note,
            },
        };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

// update a note, login required
router.put(
    "/updatenote/:noteId",
    fetchuser,
    noteValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // if there are any errors then send bad status.
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.user.id;
        const noteId = req.params.noteId;
        const updatedNoteData = {
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
        };
        try {
            const note = await noteService.updateNote(
                userId,
                noteId,
                updatedNoteData
            );
            const responseData = { data: { note: note } };

            res.status(200).json(responseData);
        } catch (error) {
            console.log(error.errors[0].msg);
            res.status(error.errors[0].status).json(error);
        }
    }
);

// delete a note, login required
router.delete(
    "/delete/:noteId",
    fetchuser,

    async (req, res) => {
        const userId = req.user.id;
        const noteId = req.params.noteId;

        try {
            const id = await noteService.deleteNote(userId, noteId);
            const responseData = { data: { id: id } };
            res.status(200).json(responseData);
        } catch (error) {
            console.log(error.errors[0].msg);
            res.status(error.errors[0].status).json(error);
        }
    }
);

module.exports = router;
