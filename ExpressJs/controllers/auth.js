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

exports.login = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email: email}});
        if(!user){
            throw new UserNotFoundError(); 
        }
        const matched = await bcrypt.compare(password, user.password);
        if(matched){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return res.send('Login Successful');
        }
        res.send('Incorrect password');
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.signup = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {name, password, email} = req.body;
    try{
        const bcryptPassword = await bcrypt.hash(password, 12);
        const user = await User.create({name: name, password: bcryptPassword, email: email, role: 'CUSTOMER'});
        if(!user){
            throw new UserNotFoundError();
        }
        const cart = await user.getCart();
        if(cart)
            return;
        await user.createCart();
        res.send('User Signup Successful');
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.logout = async (req, res, next) => {
    req.session.destroy(err => {
        if(err){
            console.log(err);
            return res.status(500).send('Logout Failed');
        }
        res.send('Logged Out');
    });
};

exports.resetPassword = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    crypto.randomBytes(32, async (err, buffer) => {
        if(err){
            console.log(err);
            return res.status(500).send('Reset Failed');
        }
        const token = buffer.toString('hex');
        try{
            const user = await User.findOne({where: {email: req.body.email}});
            if(!user){
                throw new UserNotFoundError('Account not Found', 404, 'No account found for given email');
            }
            user.resetToken = token;
            user.resetTokenExpiration = new Date().getTime() + 3600000;//Date.now() + 3600000;
            await user.save()
            res.send(token);
        }
        catch(err) {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        };
    });
};

exports.verifyReset = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const token = req.params.token;
    const newPassword = req.body.password;
    try{
        const user = await User.findOne({where: {resetToken: token, resetTokenExpiration: {[Op.gt]: new Date().getTime()}}});
        if(!user){
            return res.status(400).send('Invalid Token');
        }
        const bcryptPassword = await bcrypt.hash(newPassword, 12);
        user.password = bcryptPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.send('Password Reset Successful');
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};