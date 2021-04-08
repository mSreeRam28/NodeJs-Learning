const Link = require('../../models/link');
const User = require('../../models/user');
const Vote = require('../../models/vote');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    post: async (parent, {url, description}, context) => {
        const {userId} = context;
        if(!userId)
            throw new Error('Authentication Failed');

        const link = await Link.create({
            url,
            description,
            userId
        });

        context.pubsub.publish('New_Link', link);
        return link;
    },
    updateLink: async (parent, {id, url, description}, context) => {
        const {userId} = context;
        if(!userId)
            throw new Error('Authentication Failed');

        let link = await Link.findOne({where: {id: id, userId: userId}});
        if(link){
            if(url)
                link.url = url;
            if(description)
                link.description = description;
            await link.save();
        }
        else
            throw new Error('Update Failed');
        return link;
    },
    deleteLink: async (parent, {id}, context) => {
        const {userId} = context;
        if(!userId)
            throw new Error('Authentication Failed');

        const link = await Link.findOne({where: {id: id, userId: userId}});
        if(link)
            await link.destroy();
        else
            throw new Error('Delete Failed');
        return link;
    },
    signup: async (parent, {name, email, password}) => {
        const existingUser = await User.findOne({where: {email: email}});
        if(existingUser)
            throw new Error('User Already Exists');

        const bcryptPassword = await bcrypt.hash(password, 12);

        if(!bcryptPassword)
            throw new Error('User Signup Failed');

        const createdUser = await User.create({name: name, email: email, password: bcryptPassword});
        return createdUser;
    },
    login: async (parent, {email, password}) => {
        const user = await User.findOne({where: {email: email}});
        if(!user){
            throw new Error('User not Found');
        }
        const match = await bcrypt.compare(password, user.password);

        if(!match){
            throw new Error('Email or password incorrect');
        }

        const token = jwt.sign({name: user.name, email: user.email,id: user.id}, 'secret key', {expiresIn: '1h'});
        return {user: user, token: token};
    },
    vote: async (parent, {linkId}, context) => {
        const {userId} = context;
        if(!userId)
            throw new Error('Authentication Failed');

        const vote = await Vote.findOne({where: {linkId: linkId, userId: userId}});

        if(vote)
            throw new Error('Already Voted');
        
        const createdVote = await Vote.create({
            linkId: linkId,
            userId: userId
        });
        context.pubsub.publish('New_Vote', createdVote);
        return createdVote;
    }
};