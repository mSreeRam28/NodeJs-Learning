const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const {Op} = require('sequelize');
const { validationResult } = require('express-validator/check');

const checkValidationCode = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
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
                return res.send('User not found'); 
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
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
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
            user.getCart()
                .then(cart => {
                    if(cart)
                        return;
                    return user.createCart();
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            res.send('User Signup Successful');
        })
        .catch(err => console.log(err));
};

exports.logout = (req, res, next) => {
    console.log(req.session.user);
    req.session.destroy(err => {
        if(err){
            console.log(err);
            return;
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
            return res.send('Reset Failed');
        }
        const token = buffer.toString('hex');
        User.findOne({where: {email: req.body.email}})
            .then(user => {
                if(!user){
                    return res.send('No account with the email found');
                }
                user.resetToken = token;
                user.resetTokenExpiration = new Date().getTime() + 3600000;//Date.now() + 3600000;
                user.save()
                    .then(result => {
                        res.send(token);
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
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
                return res.send('Invalid Token');
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
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};