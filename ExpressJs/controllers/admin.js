const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.send('Get Add product page');
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const {title, price, description} = req.body;
    const product = new Product(title, price, description);
    product.save();
    res.send('Added Product Successfully');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.send(products);
    });
};