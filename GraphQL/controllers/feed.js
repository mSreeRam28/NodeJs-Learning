const Post = require('../models/post');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const _ = require('lodash');
const io = require('../socket');

exports.getPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);
    try{
        const post = await Post.findByPk(postId);
        if(_.isNil(post)){
            const error = new Error('No post found');
            error.httpStatusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Fetched Post Successfully', post: post});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.getPosts = async (req, res, next) => {
    let pageNo = req.query.page;
    pageNo = parseInt(pageNo);
    const pageCapacity = 2;

    try{
        const posts = await Post.findAll({offset: ((pageNo-1)*pageCapacity), limit: pageCapacity, subQuery: false})
        if(_.isNil(posts)){
            const error = new Error('No posts found');
            error.httpStatusCode = 404;
            throw error;
        }
        res.status(200).json({message: 'Fetched Posts Successfully', posts: posts});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.addPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    const {title, content} = req.body;
    try{
        const post = await Post.create({
            title: title,
            content: content,
            userId: req.userId
        });
        if(_.isNil(post)){
            const error = new Error('Post not Created');
            error.httpStatusCode = 500;
            throw error;
        }
        io.getIO().emit('posts', {action: 'Create Post', post: post});
        res.status(201).json({message: 'Created Post Successfully', post: post});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.editPost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);
    try{
        const user = await User.findByPk(req.userId);
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 404;
            throw error;
        }
        const posts = await user.getPosts({where: {id: postId}});
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
        const result = await post.save();
        res.status(200).json({message: 'Post Edited Successfully', editedPost: result});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
};

exports.deletePost = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({message: 'Errors in Input Data', errors: errors.array()});
    }

    let postId = req.params.postId;
    postId = parseInt(postId);

    try{
        const user = await User.findByPk(req.userId);
        if(_.isNil(user)){
            const error = new Error('User not Found');
            error.httpStatusCode = 404;
            throw error;
        }
        const posts = await user.getPosts({where: {id: postId}});
        if(_.isNil(posts) || _.isEmpty(posts)){
            const error = new Error('Post not found');
            error.httpStatusCode = 404;
            throw error;
        }
        const post = posts[0];
        await post.destroy();
        res.status(200).json({message: 'Post Deleted Successfully'});
    }
    catch(err) {
        if(!err.httpStatusCode)
            err.httpStatusCode = 500;
        next(err);
    };
        
};