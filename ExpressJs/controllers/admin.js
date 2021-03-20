const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.send('Get Add product page');
};

exports.postAddProduct = (req, res, next) => {
    console.log(req.body);
    const {title, price, description} = req.body;
    const product = new Product(null, title, price, description);
    product.save();
    res.send('Added Product Successfully');
};

exports.putEditProduct = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    const { title, price, description } = req.body;
    Product.findById(prodId, product => {
        if(product){
            const editedProduct = new Product(prodId, title, price, description);
            editedProduct.save();
            res.send('Product Edited Successfully');
        }
        else
            res.send('Product Not Found');
    });
};

exports.deleteProduct = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    Product.findById(prodId, product => {
        if(product){
            Product.delete(prodId);
            res.send('Product Deleted Successfully');
        }
        else
            res.send('Product Not Found');
    });
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.send(products);
    });
};