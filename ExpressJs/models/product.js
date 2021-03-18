const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '..', 'data', 'products.json');

const getProductsFromFile = callback => {
    fs.readFile(p, (err, fileContent) => {
        if(err){
            callback([]);
        }
        else{
            callback(JSON.parse(fileContent));
        }
    });
};

module.exports = class Product {
    constructor(title, price, description){
        this.title = title;
        this.price = price;
        this.description = description;
    }

    save(){
        this.id = Math.random() * (899) + 100;
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback){
        getProductsFromFile(callback);
    }

    static findById(id, callback){
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
};