const jwt = require('jsonwebtoken');
const _ = require('lodash');

module.exports = (req, res, next) => {
    const bearerToken = req.get('Authorization');
    if(_.isNil(bearerToken)){
        req.isAuth = false;
        return next();
    }
    const token = bearerToken.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secret key');
    }
    catch(err){
        req.isAuth = false;
        return next();
    }
    if(_.isNil(decodedToken)){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodedToken.id;
    next();
};