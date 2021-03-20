const Product = require('../models/product');
const Cart = require('../models/cart');

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
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = {products: [], totalPrice: cart.totalPrice};
            products.forEach(product => {
                const prod = cart.products.find(p => p.id === product.id);
                if(prod){
                    cartProducts.products.push({product: product, quantity: prod.quantity});
                }
            });
            res.send(cartProducts);
        });
    });
};

exports.postCart = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    Product.findById(prodId, product => {
        if(product){
            Cart.addCart(prodId, product.price);
            res.send('Added to Cart Successfully');
        }
        else
            res.send('Product Not Found');
    });
};

exports.deleteCart = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    Product.findById(prodId, product => {
        if(product){
            Cart.delete(prodId, product.price);
            res.send('Deleted from Cart Successfully');
        }
        else
            res.send('Product Not Found');
    });
};

exports.getOrders = (req, res, next) => {
    res.send('Get Orders page');
};

exports.getCheckout = (req, res, next) => {
    res.send('Get Checkout page');
};