// const User = require('../models/user');
// const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const _ = require('lodash');
// const jwt = require('jsonwebtoken');

// exports.signUp = (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty())
//         return res.status(422).json({message: 'Errors in input data', errors: errors});

//     const {name, email, password} = req.body;
//     bcrypt.hash(password, 12)
//         .then(bcryptPassword => {
//             if(_.isNil(bcryptPassword))
//                 throw new Error('User Signup Failed');
//             return User.create({name: name, email: email, password: bcryptPassword, status: 'Active'});
//         })
//         .then(result => {
//             res.status(201).json({message: 'User Signup Successful', user: result});
//         })
//         .catch(err => {
//             if(!err.httpStatusCode)
//                 err.httpStatusCode = 500;
//             next(err);
//         });
// };

// exports.login = (req, res, next) => {
//     const errors = validationResult(req);
//     if(!errors.isEmpty())
//         return res.status(422).json({message: 'Errors in input data', errors: errors});

//     const {email, password} = req.body;
//     let loginUser;
//     User.findOne({where: {email: email}})
//         .then(user => {
//             if(_.isNil(user)){
//                 const error = new Error('User not Found');
//                 error.httpStatusCode = 403;
//                 throw error;
//             }
//             loginUser = user;
//             return bcrypt.compare(password, user.password);
//         })
//         .then(match => {
//             if(!match){
//                 const error = new Error('Email or password incorrect');
//                 error.httpStatusCode = 403;
//                 throw error;
//             }
//             const token = jwt.sign({name: loginUser.name, email: loginUser.email,id: loginUser.id}, 'secret key', {expiresIn: '1h'});
//             res.status(200).json({message: 'Login Successful', token: token});
//         })
//         .catch(err => {
//             if(!err.httpStatusCode)
//                 err.httpStatusCode = 500;
//             next(err);
//         });
// };

// exports.getStatus = (req, res, next) => {
//     User.findByPk(req.userId)
//         .then(user => {
//             if(_.isNil(user)){
//                 const error = new Error('User not Found');
//                 error.httpStatusCode = 403;
//                 throw error;
//             }
//             res.status(200).json({status: user.status});
//         })
//         .catch(err => {
//             if(!err.httpStatusCode)
//                 err.httpStatusCode = 500;
//             next(err);
//         });
// };

// exports.editStatus = (req, res, next) => {
//     const status = req.body.status;
//     User.findByPk(req.userId)
//         .then(user => {
//             if(_.isNil(user)){
//                 const error = new Error('User not Found');
//                 error.httpStatusCode = 403;
//                 throw error;
//             }
//             user.status = status;
//             return user.save();
//         })
//         .then(user => {
//             res.status(200).json({message: 'User Status Edited successfully', EditedStatus: user.status});
//         })
//         .catch(err => {
//             if(!err.httpStatusCode)
//                 err.httpStatusCode = 500;
//             next(err);
//         });
// };



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

exports.editStatus = async (req, res, next) => {
    const status = req.body.status;
    try{
        const user = await User.findByPk(req.userId);
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 403;
            throw error;
        }
        user.status = status;
        const editedUser = await user.save();
        res.status(200).json({message: 'User Status Edited successfully', EditedStatus: editedUser.status});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};