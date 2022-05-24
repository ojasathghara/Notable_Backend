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

    const oldTag = await Tag.findById(tagId);
    if (!oldTag) {
        throw {
            errors: [
                {
                    value: userId,
                    status: 404,
                    msg: "Tag not found",
                    param: "userId",
                    location: "body",
                },
            ],
        };
    }

    if (userId !== oldTag.user.toString()) {
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

    const tag = await Tag.findByIdAndDelete(tagId);
    return tag._id;
};

module.exports = { fetchAll, addTag, deleteTag };
