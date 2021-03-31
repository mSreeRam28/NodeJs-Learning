const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const _ = require('lodash');

exports.getPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);
    Post.findByPk(postId)
        .then(post => {
            if(_.isNil(post)){
                const error = new Error('No post found');
                error.httpStatusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Fetched Post Successfully', post: post});
        })
        .catch(err => {
            if(!err.httpStatusCode)
                err.httpStatusCode = 500;
            next(err);
        });
};

exports.getPosts = (req, res, next) => {
    let pageNo = req.query.page;
    pageNo = parseInt(pageNo);
    const pageCapacity = 2;

    Post.findAll({offset: ((pageNo-1)*pageCapacity), limit: pageCapacity, subQuery: false})
        .then(posts => {
            if(_.isNil(posts)){
                const error = new Error('No posts found');
                error.httpStatusCode = 404;
                throw error;
            }
            res.status(200).json({message: 'Fetched Posts Successfully', posts: posts});
        })
        .catch(err => {
            if(!err.httpStatusCode)
                err.httpStatusCode = 500;
            next(err);
        });
};

exports.addPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    const {title, content} = req.body;
    Post.create({
        title: title,
        content: content,
        userId: req.userId
    })
    .then(post => {
        if(_.isNil(post)){
            const error = new Error('Post not Created');
            error.httpStatusCode = 500;
            throw error;
        }
        res.status(201).json({message: 'Created Post Successfully', post: post});
    })
    .catch(err => {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    });
};

exports.editPost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);
    User.findByPk(req.userId)
        .then(user => {
            if(_.isNil(user)){
                const error = new Error('User not Found');
                error.httpStatusCode = 404;
                throw error;
            }
            return user.getPosts({where: {id: postId}});
        })
        .then(posts => {
            if(_.isNil(posts) || _.isEmpty(posts)){
                const error = new Error('Post not found');
                error.httpStatusCode = 404;
                throw error;
            }
            const post = posts[0];
            Object.keys(req.body).forEach(field => {
                if(['title', 'content'].includes(field)){
                    post[field] = req.body[field];
                }
            });
            return post.save();
        })
        .then(result => {
            res.status(200).json({message: 'Post Edited Successfully', editedPost: result});
        })
        .catch(err => {
            if(!err.httpStatusCode)
                err.httpStatusCode = 500;
            next(err);
        });
};

exports.deletePost = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);

    User.findByPk(req.userId)
        .then(user => {
            if(_.isNil(user)){
                const error = new Error('User not Found');
                error.httpStatusCode = 404;
                throw error;
            }
            return user.getPosts({where: {id: postId}});
        })
        .then(posts => {
            if(_.isNil(posts) || _.isEmpty(posts)){
                const error = new Error('Post not found');
                error.httpStatusCode = 404;
                throw error;
            }
            const post = posts[0];
            return post.destroy();
        })
        .then(result => {
            res.status(200).json({message: 'Post Deleted Successfully'});
        })
        .catch(err => {
            if(!err.httpStatusCode)
                err.httpStatusCode = 500;
            next(err);
        });
        
};