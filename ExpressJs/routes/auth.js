const express = require('express');

const { body, param } = require('express-validator/check');

const User = require('../models/user');

const authController = require('../controllers/auth');

const isAuthenticated = require('../middleware/is-authenticated');

const router = express.Router();

const signup = [body('email').isEmail().withMessage('Not a valid Email').custom((value, {req}) => {
                    return User.findOne({where: {email: value}})
                        .then(user => {
                            if(user){
                                return Promise.reject('Email already Exists');
                            }
                        });
                }).normalizeEmail(),
                body('password').isLength({min: 8}).withMessage('Password must be 8 characters long').trim().exists(),
                body('confirmPassword').custom((value, {req}) => {
                    if(value !== req.body.password){
                        throw new Error('Confirm Password must match with Password');
                    }
                    return true;
                }).trim().exists()];

const login = [body('email').isEmail().withMessage('Not a valid Email').normalizeEmail().exists(),
                body('password').isLength({min: 8}).withMessage('Password must be 8 characters long').trim().exists()];

const tokenParam = param('token').exists().isAlphanumeric();

router.post('/login', login, authController.login);

router.post('/signup', signup, authController.signup);

router.post('/logout', isAuthenticated.loginAuthentication, authController.logout);

router.post('/reset', login[0], authController.resetPassword);

router.put('/reset/:token', login[1], tokenParam, authController.verifyReset);

module.exports = router;