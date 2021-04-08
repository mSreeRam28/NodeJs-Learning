const Link = require('../../models/link');
const User = require('../../models/user');
const { Op } = require('sequelize');

module.exports = {
    feed: async (parent, {filter, pageNo, perPage, orderBy}) => {
        pageNo = pageNo || 1;
        const limit = perPage ? perPage : 1;
        const where = filter ? {
            [Op.or]: [
                {url: {[Op.like]: '%'+filter+'%'}},
                {description: {[Op.like]: '%'+filter+'%'}}
            ]
        } : {};

        const obToArray = Object.keys(orderBy).map(field => {
            const arr = [];
            arr.push(field.toString());
            arr.push(orderBy[field]);
            return arr;
        }); //Converting orderBy objects to arrays (Eg. {createdAt: 'DESC'} to ['createdAt', 'DESC'])
        return await Link.findAll({where, offset: (pageNo-1)*perPage, limit, order: [obToArray]});
    },
    link: async (parent, {id}) => await Link.findOne({where: {id: id}}),
}