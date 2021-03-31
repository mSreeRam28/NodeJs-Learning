const express = require('express');

const { body, param, query } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

const addPostValidation = [body('title').trim().isLength({min: 5}).withMessage('Title must contain atleast 5 characters').exists(),
                        body('content').trim().isLength({min: 5}).withMessage('Content must contain atleast 5 characters').exists()];

const editPostValidation = [body('title').trim().isLength({min: 5}).withMessage('Title must contain atleast 5 characters').optional(),
                        body('content').trim().isLength({min: 5}).withMessage('Content must contain atleast 5 characters').optional()];

const paramValidation = param('postId').isInt().withMessage('Post Id must be an integer').exists();

const queryValidation = query('page').isInt().withMessage('Page query must be an integer').exists();

router.get('/post/:postId', paramValidation, feedController.getPost);

router.get('/posts', queryValidation, feedController.getPosts);

router.post('/addpost', addPostValidation, feedController.addPost);

router.put('/editpost/:postId', editPostValidation, feedController.editPost);

router.delete('/deletepost/:postId', paramValidation, feedController.deletePost);

module.exports = router;