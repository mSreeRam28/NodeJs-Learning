const express = require('express');

const authController = require('../controllers/auth');

const User = require('../models/user');

const isAuthenticated = require('../middleware/is-authenticated');

const { body } = require('express-validator');

const router = express.Router();

const signupValidation = [body('email').isEmail().withMessage('Not a valid Email').custom((value, {req}) => {
                    return User.findOne({where: {email: value}})
                        .then(user => {
                            if(user){
                                return Promise.reject('Email already Exists');
                            }
                        });
                }).normalizeEmail(),
                body('name').trim().isLength({min: 3}).withMessage('Name must contain atleast 3 characters'),
                body('password').isLength({min: 8}).withMessage('Password must be 8 characters long').trim().exists(),
                body('confirmPassword').custom((value, {req}) => {
                    if(value !== req.body.password){
                        throw new Error('Confirm Password must match with Password');
                    }
                    return true;
                }).trim().exists()];

const loginValidation = [body('email').isEmail().withMessage('Not a valid Email').normalizeEmail().exists(),
                        body('password').isLength({min: 8}).withMessage('Password must be 8 characters long').trim().exists()];

router.post('/signup', signupValidation, authController.signUp);

router.post('/login', loginValidation, authController.login);

router.get('/status', isAuthenticated, authController.getStatus);

router.put('/editstatus', isAuthenticated, body('status').trim().notEmpty().withMessage('Status must be provided'), authController.editStatus);

module.exports = router;