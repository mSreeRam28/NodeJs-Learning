const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const {title, price, description} = req.body;
    req.user.createProduct({
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
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    const { title, price, description } = req.body;
    req.user.getProducts({where: {id: prodId}})
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
    req.user.getProducts({where: {id: prodId}})
    // Product.destroy({where: {id: prodId}})
        .then(products => {
            const product = products[0];
            product.destroy();
            res.send('Product deleted Successfully');
        })
        .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.send(products);
        })
        .catch(err => console.log(err));
};