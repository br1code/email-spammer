module.exports.logger = (req, res, next) => {
    console.log(`Someone made a request to the server: ${req.method} ${req.url}`);
    next();
};
