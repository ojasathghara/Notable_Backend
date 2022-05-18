const setResponse = (res, status, type, message, data = {}) => {
    res.status(status);
    res.json({
        type: type,
        message: message,
        data: data,
    });

    return res;
};

module.exports = { generateResponseData, setResponse };
