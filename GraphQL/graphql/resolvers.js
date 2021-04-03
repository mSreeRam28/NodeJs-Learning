const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const isAuth = req => {
    if(!req.isAuth){
        const error = new Error('Authentication failed');
        error.httpStatusCode = 403;
        throw error;
    }
};

module.exports = {

    signup: async function({userInput}, req){
        const {name, email, password} = userInput;
        const errors = [];
        if(!validator.isEmail(email))
            errors.push({message: 'Not a valid Email'});
        if(validator.isEmpty(password) || !validator.isLength(password, {min: 8}))
            errors.push({message: 'Password must have atleast 8 charcters'});
        if(errors.length > 0){
            const error = new Error('Errors in input data');
            error.data = errors;
            error.httpStatusCode = 422;
            throw error;
        }

        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser)
            throw new Error('User Already Exists');

        const bcryptPassword = await bcrypt.hash(password, 12);

        if(_.isNil(bcryptPassword))
            throw new Error('User Signup Failed');

        const createdUser = await User.create({name: name, email: email, password: bcryptPassword, status: 'Active'});
        return createdUser;
    },

    login: async function({email, password}, req){
        const errors = [];
        if(!validator.isEmail(email))
            errors.push({message: 'Not a valid Email'});
        if(validator.isEmpty(password) || !validator.isLength(password, {min: 8}))
            errors.push({message: 'Password must have atleast 8 charcters'});
        if(errors.length > 0){
            const error = new Error('Errors in input data');
            error.data = errors;
            error.httpStatusCode = 422;
            throw error;
        }

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
        return {message: 'User Login Successful', token: token};
    },

    addPost: async function({postData}, req){
        isAuth(req);

        const post = await Post.create({
            title: postData.title,
            content: postData.content,
            userId: req.userId
        }, {include: User});
        if(_.isNil(post)){
            const error = new Error('Post not Created');
            error.httpStatusCode = 500;
            throw error;
        }
        return post;
    },

    getPost: async function({postId}, req){
        try{
            const post = await Post.findByPk(postId, {include: User});
            if(_.isNil(post)){
                const error = new Error('No post found');
                error.httpStatusCode = 404;
                throw error;
            }
            return post;
        }
        catch(err){
            throw err;
        }
    },

    getPosts: async function({page}, req){
        const pageCapacity = 2;

        try{
            const posts = await Post.findAll({offset: ((page-1)*pageCapacity), limit: pageCapacity, subQuery: false, include: User})
            if(_.isNil(posts)){
                const error = new Error('No posts found');
                error.httpStatusCode = 404;
                throw error;
            }
            return posts;
        }
        catch(err) {
            next(err);
        };
    },

    editPost: async function({postId, editPostData}, req){
        isAuth(req);

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
            Object.keys(editPostData).forEach(field => {
                if(['title', 'content'].includes(field)){
                    post[field] = editPostData[field];
                }
            });
            const result = await post.save();
            return result;
        }
        catch(err) {
            next(err);
        };
    },

    deletePost: async function({postId}, req){
        isAuth(req);

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
            return {message: 'Post Deleted Successfully'};
        }
        catch(err) {
            next(err);
        };
    },

    getStatus: async function(args, req){
        isAuth(req);

        try{
            const user = await User.findByPk(req.userId);
            if(_.isNil(user)){
                const error = new Error('User not Found');
                error.httpStatusCode = 403;
                throw error;
            }
            return user;
        }
        catch(err) {
            next(err);
        };
    },

    editStatus: async function({status}, req){
        isAuth(req);

        try{
            const user = await User.findByPk(req.userId);
            if(_.isNil(user)){
                const error = new Error('User not Found');
                error.httpStatusCode = 403;
                throw error;
            }
            user.status = status;
            const editedUser = await user.save();
            return editedUser;
        }
        catch(err) {
            next(err);
        };
    }
};