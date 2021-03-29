const _ = require('lodash');

exports.loginAuthentication = (req, res, next) => {
    if(!req.session.isLoggedIn){
        res.status(403).send('Access Denied');
    }
    else{
        next();
    }
};

exports.adminAuthentication = (req, res, next) => {
    if(_.isEqual(req.session.user.role, 'ADMIN')){
        next();
    }
    else{
        res.status(401).send('You are not Authorized');
    }
};