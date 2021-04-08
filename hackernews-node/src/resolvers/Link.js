const Link = require('../../models/link');

module.exports = {
    user: async (parent, args, context) => {
        const link = await Link.findOne({where: {id: parent.id}});
        return link.getUser();
    },
    votes: async (parent, args, context) => {
        const link = await Link.findOne({where: {id: parent.id}});
        return link.getVotes();
    }
}