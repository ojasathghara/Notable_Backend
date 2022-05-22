const Tag = require("../models/Tag");
const User = require("../models/User");

const fetchAll = async (userId) => {
    const tags = await Tag.find({ user: userId });
    return tags;
};

const addTag = async (userId, newTagData) => {
    const user = await User.findById(userId).select("-password"); // select all fields instead of the password
    if (!user) {
        throw {
            type: 401,
            message: "Please authenticate using correct credentials",
        };
    }

    const userIdObj = user._id;
    const tag = await Tag.create({
        user: userIdObj,
        name: newTagData.name,
        color: newTagData.color,
    });

    return tag;
};

const deleteTag = async (userId, tagId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw {
            type: 401,
            message: "Please authenticate using correct credentials",
        };
    }

    const oldTag = await Tag.findById(tagId);
    if (!oldTag) {
        throw { type: 404, message: "Tag not found" };
    }

    if (userId !== oldTag.user.toString()) {
        throw {
            type: 401,
            message: "Please authenticate yourself using correct credentials",
        };
    }

    const tag = await Tag.findByIdAndDelete(tagId);
    return tag._id;
};

module.exports = { fetchAll, addTag, deleteTag };
