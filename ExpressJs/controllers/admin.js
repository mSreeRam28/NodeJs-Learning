const Product = require('../models/product');
const _ = require('lodash');
const { validationResult } = require('express-validator');
const { ProductNotFoundError } = require('../error/error');

const checkValidationCode = (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = {};
        errors.array().forEach(obj => error[obj.param] = obj.msg);
        return JSON.stringify(error);
    }
    return null;
}

exports.postAddProduct = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {title, price, description} = req.body;
    try{
        const result = await req.session.user.createProduct({
            title: title,
            price: price,
            description: description
        });
        if(_.isNil(result)){
            return res.status(500).send('Adding Product failed');
        }
        res.send('Added Product Successfully');
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.putEditProduct = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    try{
        const products = await req.session.user.getProducts({where: {id: prodId}});
        if(_.isNil(products) || _.isEmpty(products)){
            throw new ProductNotFoundError();
        }
        const product = products[0];
        for(let field of Object.keys(req.body)){
            if(['title', 'price', 'description'].includes(field)){
                product[field] = req.body[field];
            }
        }
        await product.save();
        res.send('Product Edited Successfully');
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.deleteProduct = async (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    try{
        const products = await req.session.user.getProducts({where: {id: prodId}});
        // Product.destroy({where: {id: prodId}})
        if(_.isNil(products) || _.isEmpty(products)){
            throw new ProductNotFoundError();
        }
        const product = products[0];
        await product.destroy();
        res.send('Product deleted Successfully');
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.getProducts = async (req, res, next) => {
    try{
        const products = await req.session.user.getProducts();
        if(_.isNil(products)){
            throw new ProductNotFoundError();
        }
        res.send(products);
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};