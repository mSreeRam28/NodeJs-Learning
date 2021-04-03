const express = require('express');

const sequelize = require('./util/database');

const User = require('./models/user');
const Post = require('./models/post');

const _ = require('lodash');

const isAuthenticated = require('./middleware/is-authenticated');

const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(isAuthenticated);

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
    customFormatErrorFn(err){
        if(_.isNil(err.originalError))
            return err;
        let {data, httpStatusCode} = err.originalError;
        httpStatusCode = httpStatusCode || 500;
        const message = err.message || 'Error Occured';
        return {message: message, data: data, httpStatusCode: httpStatusCode};
    }
}));

app.use((req, res, next) => {
    res.status(404).json({message: 'Page Not Found'});
});

app.use((error, req, res, next) => {
    const statusCode = error.httpStatusCode || 500;
    error.ErrorMessage = error.message;
    res.status(statusCode).json({errors: error});
});

User.hasMany(Post);
Post.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });