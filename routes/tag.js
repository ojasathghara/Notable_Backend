const express = require("express");
const { body, validationResult } = require("express-validator");
const tagService = require("../services/tag");
const { fetchuser } = require("../middlewares/fetchuser");

const router = express.Router();

router.get("/fetchalltags", fetchuser, async (req, res) => {
    const userId = req.user.id;

    try {
        const tags = await tagService.fetchAll(userId);
        const responseData = { data: { tags: tags } };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

const tagValidator = [
    body("name", "Tag must have a name").not().isEmpty(),
    body("color", "Tag must have a color").not().isEmpty(),
];
router.post("/createtag", fetchuser, tagValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // if there are any errors then send bad status.
        return res.status(400).json({ errors: errors.array() });
    }

    const newTagData = {
        name: req.body.name,
        color: req.body.color,
    };

    const userId = req.user.id;
    try {
        const tag = await tagService.addTag(userId, newTagData);
        const responseData = { data: { tag: tag } };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

router.delete("/deletetag/:id", fetchuser, async (req, res) => {
    const userId = req.user.id;
    const tagId = req.params.id;

    try {
        const id = await tagService.deleteTag(userId, tagId);
        const responseData = { data: { id: id } };
        res.status(200).json(responseData);
    } catch (error) {
        console.log(error.errors[0].msg);
        res.status(error.errors[0].status).json(error);
    }
});

module.exports = router;
