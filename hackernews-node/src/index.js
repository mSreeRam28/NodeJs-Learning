const { ApolloServer } = require('apollo-server');
const { PubSub } = require('apollo-server');

const fs = require('fs');
const path = require('path');

const sequelize = require('../util/database');

const Link = require('../models/link');
const User = require('../models/user');
const Vote = require('../models/vote');

const { getUserId } = require('../util/isAuth');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const UserResolver = require('./resolvers/User');
const LinkResolver = require('./resolvers/Link');
const VoteResolver = require('./resolvers/Vote');

const pubsub = new PubSub();

const resolvers = {
    Query,
    Mutation,
    Subscription,
    User: UserResolver,
    Link: LinkResolver,
    Vote: VoteResolver
};

const server = new ApolloServer({
    typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
    resolvers,
    context: ({req}) => {
        return{
            req,
            pubsub,
            userId: req && req.headers.authorization ? getUserId(req) : null
        };
    }
});

User.hasMany(Link);
Link.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

Vote.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Vote);

Vote.belongsTo(Link, {constraints: true, onDelete: 'CASCADE'});
Link.hasMany(Vote);

sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        console.log(`Synced models to database`);
        server
            .listen()
            .then(({url}) => {
                console.log(`Server is running on ${url}`);
            })
    })