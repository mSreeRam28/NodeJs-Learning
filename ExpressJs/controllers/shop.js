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
};

exports.getProducts = async (req, res, next) => {
    try{
        const products = await Product.findAll();
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

exports.getProduct = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let productId = req.params.productId;
    productId = parseInt(productId);
    try{
        const product = await Product.findByPk(productId);
        if(_.isNil(product))
            throw new ProductNotFoundError();
        res.send(product);
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.getIndex = (req, res, next) => {
    res.send('Welcome page');
};

exports.getCart = async (req, res, next) => {
    // Cart.getCart(cart => {
    //     Product.fetchAll(products => {
    //         const cartProducts = {products: [], totalPrice: cart.totalPrice};
    //         products.forEach(product => {
    //             const prod = cart.products.find(p => p.id === product.id);
    //             if(prod){
    //                 cartProducts.products.push({product: product, quantity: prod.quantity});
    //             }
    //         });
    //         res.send(cartProducts);
    //     });
    // });
    try{
        const cart = await req.session.user.getCart();
        const products = await cart.getProducts();
        if(_.isNil(products))
            throw new ProductNotFoundError();
        res.send(products);
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.postCart = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    let newQuantity = 1;
    try{
        const cart = await req.session.user.getCart();
        const products = await cart.getProducts({where: {id: prodId}});
        let existingProduct;
        if(products.length > 0){
            existingProduct = products[0];
        }
        if(existingProduct){
            let oldQuantity = existingProduct.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            await cart.addProduct(existingProduct, { through: {quantity: newQuantity} });
            return;
        }
        const product = await Product.findByPk(prodId);
        if(!product)
            throw new ProductNotFoundError();
        await cart.addProduct(product, { through: {quantity: newQuantity} });
        res.send('Added to cart Successfully');
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
    // Product.findById(prodId, product => {
    //     if(product){
    //         Cart.addCart(prodId, product.price);
    //         res.send('Added to Cart Successfully');
    //     }
    //     else
    //         res.send('Product Not Found');
    // });
};

exports.deleteCart = async (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    try{
        const cart = await req.session.user.getCart();
        const products = await cart.getProducts({where: {id: prodId}});
        let product;
        if(products.length > 0){
            product = products[0];
            await product.cartItem.destroy();
            res.send('Deleted Cart Item Successfully');
        }
        else
            throw new ProductNotFoundError();
    }
    catch(err) {
        if(err instanceof Error)
            return next(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
    // Product.findById(prodId, product => {
    //     if(product){
    //         Cart.delete(prodId, product.price);
    //         res.send('Deleted from Cart Successfully');
    //     }
    //     else
    //         res.send('Product Not Found');
    // });
};

exports.createOrder = async (req, res, next) => {
    try{
        const cart = await req.session.user.getCart();
        const products = await cart.getProducts();
        const order = await req.session.user.createOrder();
        await order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
        }));
        await cart.setProducts(null);
        res.send('Order created Successfully');
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};

exports.getOrders = async (req, res, next) => {
    try{
        const orders = await req.session.user.getOrders({include: ['products']});
        res.send(orders);
    }
    catch(err) {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    };
};