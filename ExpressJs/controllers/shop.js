const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.send(products);
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
    let productId = req.params.productId;
    productId = parseInt(productId);
    Product.findByPk(productId)
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            console.log(err);
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
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            res.send(products);
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
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
            fetchedCart.addProduct(product, { through: {quantity: newQuantity} });
        })
        .then(result => {
            res.send('Added to cart Successfully');
        })
        .catch(err => console.log(err));
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
    let prodId = req.params.productId;
    prodId = parseInt(prodId);
    req.user.getCart()
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
            res.send('Product not Found');
        })
        .catch(err => console.log(err));
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
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }))
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.send('Order created Successfully');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders({include: ['products']})
        .then(orders => {
            res.send(orders);
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req, res, next) => {
    res.send('Get Checkout page');
};