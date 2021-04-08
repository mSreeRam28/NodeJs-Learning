const Vote = require('../../models/vote');

module.exports = {
    user: async (parent, args, context) => {
        const vote = await Vote.findOne({where: {id : parent.id}});
        return await vote.getUser();
    },
    link: async (parent, args, context) => {
        const vote = await Vote.findOne({where: {id : parent.id}});
        return await vote.getLink();
    }
}