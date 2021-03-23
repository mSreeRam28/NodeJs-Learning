const express = require('express');

const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const sequelize = require('./util/database');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-product');
const Order = require('./models/order');
const OrderItem = require('./models/order-product');

app.use(express.json());
const store = new MySqlStore({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'nodelearningdb'
});
app.use(session({secret: 'secret key', resave: false, saveUninitialized: false, store: store}));
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findByPk(req.session.user.id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFoundPage);

//Product-User association
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
//User-Cart association
User.hasOne(Cart);
Cart.belongsTo(User);
//Cart-Product association
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });
//Order-User association
User.hasMany(Order);
Order.belongsTo(User);
//Order-Product association
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
    // .sync({force: true})
    // .sync({alter: true})
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user)
            return User.create({name: 'Ram',password: 'Ram', email: 'test@test.com', role: 'ADMIN'});
        return user;
    })
    .then(user => {
        user.getCart()
            .then(cart => {
                if(cart)
                    return cart;
                return user.createCart();
            })
            .catch(err => console.log(err));
    })
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));