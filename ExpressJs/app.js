const express = require('express');

const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
// const redis = require("redis");
// const redisClient = redis.createClient();
// const redisStore = require('connect-redis')(session);
const sequelize = require('./util/database');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');

const isAuthenticated = require('./middleware/is-authenticated'); 

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-product');
const Order = require('./models/order');
const OrderItem = require('./models/order-product');

const dotenv = require('dotenv');
dotenv.config();

const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(compression());
app.use(express.json());
const store = new MySqlStore({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, store: store}));
// app.use(cookieParser());
// app.use(csrf({cookie: true}));

// app.use(
//     session({
//         secret:"terces", 
//         resave:false, 
//         saveUninitialized:false,
//         store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
//     })
// );
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    req.session.user = User.build(req.session.user);
    next();
});

app.use(authRoutes);
app.use('/admin', isAuthenticated.loginAuthentication, isAuthenticated.adminAuthentication, adminRoutes);
app.use(shopRoutes);

app.use(errorController.getNotFoundPage);

app.use((error, req, res, next) => {
    console.log('Server not found', error);
    res.status(500).send(error);
});

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
        app.listen(process.env.PORT);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        throw error;
    });