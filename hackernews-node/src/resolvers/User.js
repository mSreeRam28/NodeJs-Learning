const User = require('../../models/user');

module.exports = {
    links: async (parent, args, context) => {
        const user = await User.findOne({where: {id: parent.id}});
        return await user.getLinks();
    },
    votes: async (parent, args, context) => {
        const user = await User.findOne({where: {id: parent.id}});
        return await user.getVotes();
    }
}