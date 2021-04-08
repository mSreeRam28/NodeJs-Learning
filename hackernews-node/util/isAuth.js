const jwt = require('jsonwebtoken');

exports.getUserId = req => {
    const bearerToken = req.get('Authorization');
    if(!bearerToken){
        throw new Error('Authentication Failed');
    }
    const token = bearerToken.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'secret key');
    }
    catch(err){
        throw new Error(err);
    }
    if(!decodedToken){
        throw new Error('Authentication Failed');
    }
    return decodedToken.id;
};