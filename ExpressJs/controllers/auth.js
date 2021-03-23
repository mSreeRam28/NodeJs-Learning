const User = require('../models/user');

exports.login = (req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                if(err){
                    console.log(err);
                    return;
                }
                res.send('Login');
            });
        })
        .catch(err => console.log(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
            return;
        }
        res.send('Logged Out');
    });
};