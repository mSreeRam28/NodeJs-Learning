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

exports.getProducts = (req, res, next) => {
    Product.findAll()
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

exports.getProduct = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let productId = req.params.productId;
    productId = parseInt(productId);
    Product.findByPk(productId)
        .then(product => {
            if(_.isNil(product))
                throw new ProductNotFoundError();
            res.send(product);
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getIndex = (req, res, next) => {
    res.send('Welcome page');
};

exports.getCart = (req, res, next) => {
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
    req.session.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            if(_.isNil(products))
                throw new ProductNotFoundError();
            res.send(products);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCart = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    let fetchedCart;
    let newQuantity = 1;
    req.session.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            let product;
            if(products.length > 0){
                product = products[0];
            }
            if(product){
                let oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            if(!product)
                throw new ProductNotFoundError();
            fetchedCart.addProduct(product, { through: {quantity: newQuantity} });
        })
        .then(result => {
            res.send('Added to cart Successfully');
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    // Product.findById(prodId, product => {
    //     if(product){
    //         Cart.addCart(prodId, product.price);
    //         res.send('Added to Cart Successfully');
    //     }
    //     else
    //         res.send('Product Not Found');
    // });
};

exports.deleteCart = (req, res, next) => {
    const result = checkValidationCode(req, res);
    if(result){
        return res.status(422).send('Errors in input data\n' + result);
    }

    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    req.session.user.getCart()
        .then(cart => {
            return cart.getProducts({where: {id: prodId}});
        })
        .then(products => {
            let product;
            if(products.length > 0){
                product = products[0];
                return product.cartItem.destroy();
            }
            return;
        })
        .then(result => {
            if(result)
                res.send('Deleted Cart Item Successfully');
            else
                throw new ProductNotFoundError();
        })
        .catch(err => {
            if(err instanceof Error)
                return next(err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    // Product.findById(prodId, product => {
    //     if(product){
    //         Cart.delete(prodId, product.price);
    //         res.send('Deleted from Cart Successfully');
    //     }
    //     else
    //         res.send('Product Not Found');
    // });
};

exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.session.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.session.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }))
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.send('Order created Successfully');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getOrders = (req, res, next) => {
    req.session.user.getOrders({include: ['products']})
        .then(orders => {
            res.send(orders);
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    res.send('Get Checkout page');
};