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
    const serviceResponse = await noteService.fetchAll(userId);

    switch (serviceResponse.type) {
        case "error":
            return res.status(400).json(serviceResponse);
        case "success":
            return res.status(200).json(serviceResponse);
        case "fault":
            return res.status(400).json(serviceResponse);

        default:
            return res.status(400).json({ error: "unknown error" });
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
    const serviceResponse = await noteService.addNote(userId, newNoteData);

    switch (serviceResponse.type) {
        case "error":
            return res.status(400).json(serviceResponse);
        case "success":
            return res.status(200).json(serviceResponse);
        case "fault":
            return res.status(400).json(serviceResponse);

        default:
            return res.status(400).json({ error: "unknown error" });
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
        const serviceResponse = await noteService.updateNote(
            userId,
            noteId,
            updatedNoteData
        );

        switch (serviceResponse.type) {
            case "error":
                return res.status(400).json(serviceResponse);
            case "success":
                return res.status(200).json(serviceResponse);
            case "fault":
                return res.status(400).json(serviceResponse);

            default:
                return res.status(400).json({ error: "unknown error" });
        }
    }
);

module.exports = router;
