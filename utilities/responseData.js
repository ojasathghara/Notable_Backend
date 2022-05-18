const generateResponseData = (type, message, extras = {}) => {
    return { type: type, message: message, data: extras };
};

module.exports = { generateResponseData };
