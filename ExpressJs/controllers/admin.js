const Product = require('../models/product');
const { validationResult } = require('express-validator');

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

    console.log(req.session.req);
    const {title, price, description} = req.body;
    req.session.user.createProduct({
        title: title,
        price: price,
        description: description
    })
    .then(result => {
        console.log(result);
        res.send('Added Product Successfully');
    })
    .catch(err => {
        console.log(err);
    });
};

exports.putEditProduct = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    const { title, price, description } = req.body;
    req.session.user.getProducts({where: {id: prodId}})
        .then(products => {
            const product = products[0];
            product.title = title;
            product.price = price;
            product.description = description;
            return product.save();
        })
        .then(result => {
            res.send('Product Edited Successfully');
        })
        .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    req.session.user.getProducts({where: {id: prodId}})
    // Product.destroy({where: {id: prodId}})
        .then(products => {
            const product = products[0];
            product.destroy();
            res.send('Product deleted Successfully');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    req.session.user.getProducts()
        .then(products => {
            res.send(products);
        })
        .catch(err => console.log(err));
};