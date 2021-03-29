const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {Op} = require('sequelize');
const { validationResult } = require('express-validator/check');
const { UserNotFoundError } = require('../error/error');

const checkValidationCode = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = {};
        errors.array().forEach(obj => error[obj.param] = obj.msg);
        return JSON.stringify(error);
    }
    return null;
}

exports.login = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {email, password} = req.body;
    User.findOne({where: {email: email}})
        .then(user => {
            if(!user){
                throw new UserNotFoundError(); 
            }
            bcrypt.compare(password, user.password)
                .then(matched => {
                    if(matched){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return res.send('Login Successful');
                    }
                    res.send('Incorrect password');
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.signup = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {name, password, email} = req.body;

    bcrypt.hash(password, 12)
        .then(bcryptPassword => {
            return User.create({name: name, password: bcryptPassword, email: email, role: 'CUSTOMER'});
        })
        .then(user => {
            if(!user){
                throw new UserNotFoundError();
            }
            user.getCart()
                .then(cart => {
                    if(cart)
                        return;
                    return user.createCart();
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .then(result => {
            res.send('User Signup Successful');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.logout = (req, res, next) => {
    console.log(req.session.user);
    req.session.destroy(err => {
        if(err){
            console.log(err);
            return res.status(500).send('Logout Failed');
        }
        res.send('Logged Out');
    });
};

exports.resetPassword = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            console.log(err);
            return res.status(500).send('Reset Failed');
        }
        const token = buffer.toString('hex');
        User.findOne({where: {email: req.body.email}})
            .then(user => {
                if(!user){
                    throw new UserNotFoundError('Account not Found', 404, 'No account found for given email');
                }
                user.resetToken = token;
                user.resetTokenExpiration = new Date().getTime() + 3600000;//Date.now() + 3600000;
                user.save()
                    .then(result => {
                        res.send(token);
                    })
                    .catch(err => {
                        const error = new Error(err);
                        error.httpStatusCode = 500;
                        return next(error);
                    });
            })
            .catch(err => {
                if(err instanceof Error)
                    return next(err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};

exports.verifyReset = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const token = req.params.token;
    const newPassword = req.body.password;
    let resetUser;
    User.findOne({where: {resetToken: token, resetTokenExpiration: {[Op.gt]: new Date().getTime()}}})
        .then(user => {
            if(!user){
                return res.status(400).send('Invalid Token');
            }
            resetUser = user;
            bcrypt.hash(newPassword, 12)
                .then(bcryptPassword => {
                    resetUser.password = bcryptPassword;
                    resetUser.resetToken = undefined;
                    resetUser.resetTokenExpiration = undefined;
                    return resetUser.save();
                })
                .then(result => {
                    res.send('Password Reset Successful');
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};