const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.send(products);
    });
};

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(parseInt(productId), product => {
        res.send(product);
    });
}

exports.getIndex = (req, res, next) => {
    res.send('Welcome page');
};

exports.getCart = (req, res, next) => {
    res.send('Get Cart page');
};

exports.getOrders = (req, res, next) => {
    res.send('Get Orders page');
};

exports.getCheckout = (req, res, next) => {
    res.send('Get Checkout page');
};