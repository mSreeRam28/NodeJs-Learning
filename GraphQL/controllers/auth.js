const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json({message: 'Errors in input data', errors: errors});

    const {name, email, password} = req.body;
    try{
        const bcryptPassword = await bcrypt.hash(password, 12);

        if(_.isNil(bcryptPassword))
            throw new Error('User Signup Failed');

        const result = await User.create({name: name, email: email, password: bcryptPassword, status: 'Active'});

        res.status(201).json({message: 'User Signup Successful', user: result});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json({message: 'Errors in input data', errors: errors});

    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email: email}});
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 403;
            throw error;
        }
        const match = await bcrypt.compare(password, user.password);

        if(!match){
            const error = new Error('Email or password incorrect');
            error.httpStatusCode = 403;
            throw error;
        }
        const token = jwt.sign({name: user.name, email: user.email,id: user.id}, 'secret key', {expiresIn: '1h'});
        res.status(200).json({message: 'Login Successful', token: token});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.getStatus = async (req, res, next) => {
    try{
        const user = await User.findByPk(req.userId);
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 403;
            throw error;
        }
        res.status(200).json({status: user.status});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.editStatus = (req, res, next) => {
    const status = req.body.status;
    try{
        const user = await User.findByPk(req.userId);
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 403;
            throw error;
        }
        user.status = status;
        const user = await user.save();
        res.status(200).json({message: 'User Status Edited successfully', EditedStatus: user.status});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};