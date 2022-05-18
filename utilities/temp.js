const respond = (res, status, serviceResponse) => {
    res.status(status);
    res.json(serviceResponse);

    return res;
};

module.exports = { respond };
