const generateResponseData = (type, message, extras = {}) => {
    return { type: type, message: message, data: extras };
};

const setResponse = (res, status, serviceResponse) => {
    res.status(status);
    res.json(serviceResponse);

    return res;
};

module.exports = { generateResponseData, setResponse };
