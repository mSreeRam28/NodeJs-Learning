// const fs = require('fs');
// const path = require('path');

// const p = path.join(__dirname, '..', 'data', 'cart.json');

// module.exports = class Cart {
//     static addCart(id, price){
//         fs.readFile(p, (err, fileContent) => {
//             let cart = { products: [], totalPrice: 0 };
//             if(!err){
//                 cart = JSON.parse(fileContent);
//             }
//             const existingProduct = cart.products.find(p => p.id === id);
//             if(existingProduct){
//                 existingProduct.quantity += 1;
//             }
//             else{
//                 const createdProduct = {id: id, quantity: 1};
//                 cart.products = [...cart.products, createdProduct];
//             }
//             cart.totalPrice += price;
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 console.log(err);
//             });
//         });
//     }

//     static delete(id, price){
//         fs.readFile(p, (err, fileContent) => {
//             if(err){
//                 console.log(err);
//                 return;
//             }
//             const cart = JSON.parse(fileContent);
//             const product = cart.products.find(p => p.id === id);
//             cart.products = cart.products.filter(p => p.id !== id);
//             cart.totalPrice -= price*product.quantity;
//             fs.writeFile(p, JSON.stringify(cart), err => {
//                 console.log(err);
//             });
//         });
//     }

//     static getCart(callback){
//         fs.readFile(p, (err, fileContent) => {
//             if(err){
//                 return null;
//             }
//             const cart = JSON.parse(fileContent);
//             callback(cart);
//         });
//     }
// }

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}, { timestamps: false });

module.exports = Cart;