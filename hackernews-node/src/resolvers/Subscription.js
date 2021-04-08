const newLinkSubscribe = (parent, args, context) => {
    return context.pubsub.asyncIterator("New_Link");
}

const newVoteSubscribe = (parent, args, context) => {
    return context.pubsub.asyncIterator("New_Vote");
}

module.exports = {
    newLink: {
        subscribe: newLinkSubscribe,
        resolve: payload => {
            return payload;
        }
    },
    newVote: {
        subscribe: newVoteSubscribe,
        resolve: payload => {
            return payload;
        }
    }
}