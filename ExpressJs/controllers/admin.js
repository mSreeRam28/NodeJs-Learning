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

exports.postAddProduct = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    const {title, price, description} = req.body;
    req.session.user.createProduct({
        title: title,
        price: price,
        description: description
    })
    .then(result => {
        if(_.isNil(result)){
            return res.status(500).send('Adding Product failed');
        }
        res.send('Added Product Successfully');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.putEditProduct = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    req.session.user.getProducts({where: {id: prodId}})
        .then(products => {
            console.log(products);
            if(_.isNil(products) || _.isEmpty(products)){
                throw new ProductNotFoundError();
            }
            const product = products[0];
            for(let field of Object.keys(req.body)){
                if(['title', 'price', 'description'].includes(field)){
                    product[field] = req.body[field];
                }
            }
            return product.save();
        })
        .then(result => {
            res.send('Product Edited Successfully');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    req.session.user.getProducts({where: {id: prodId}})
    // Product.destroy({where: {id: prodId}})
        .then(products => {
            if(_.isNil(products) || _.isEmpty(products)){
                throw new ProductNotFoundError();
            }
            const product = products[0];
            product.destroy();
            res.send('Product deleted Successfully');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    req.session.user.getProducts()
        .then(products => {
            if(_.isNil(products)){
                throw new ProductNotFoundError();
            }
            res.send(products);
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};