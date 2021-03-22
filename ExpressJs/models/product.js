// const fs = require('fs');
// const path = require('path');

// const db = require('../util/database');

// const Cart = require('../models/cart');

// const p = path.join(__dirname, '..', 'data', 'products.json');

// const getProductsFromFile = callback => {
//     fs.readFile(p, (err, fileContent) => {
//         if(err){
//             callback([]);
//         }
//         else{
//             callback(JSON.parse(fileContent));
//         }
//     });
// };

// module.exports = class Product {
//     constructor(id, title, price, description){
//         this.id = id;
//         this.title = title;
//         this.price = price;
//         this.description = description;
//     }

//     save(){
//         if(!this.id){
//             this.id = Math.floor(Math.random() * (900)) + 100;
//         }
//         getProductsFromFile(products => {
//             const productIndex = products.findIndex(p => p.id === this.id);

//             if(productIndex >= 0)
//                 products[productIndex] = this;

//             else
//                 products.push(this);
                
//             fs.writeFile(p, JSON.stringify(products), err => {
//                 console.log(err);
//             });
//         });
//     }

//     static fetchAll(callback){
//         // getProductsFromFile(callback);
//         return db.execute('select * from products');
//     }

//     static findById(id, callback){
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id === id);
//             callback(product);
//         });
//     }

//     static delete(id){
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id === id);
//             products = products.filter(p => p.id !== id);
//             fs.writeFile(p, JSON.stringify(products), err => {
//                 if(!err){
//                     Cart.delete(id, product.price);
//                 }
//             });
//         });
//     }
// };

const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, { timestamps: false });

module.exports = Product;