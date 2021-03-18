exports.getNotFoundPage = (req, res, next) => {
    res.status(404).send('Page Not Found');
};