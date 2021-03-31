const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const bearerToken = req.get('Authorization');
    if(!bearerToken){
        const error = new Error('Token is required');
        error.httpStatusCode = 403;
        throw error;
    }
    const token = bearerToken.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secret key');
    }
    catch(err){
        err.httpStatusCode = 500;
        throw err;
    }
    if(!decodedToken){
        const error = new Error('Invalid Token');
        error.httpStatusCode = 403;
        throw error;
    }
    req.userId = decodedToken.id;
    next();
};