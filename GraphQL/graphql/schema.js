const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        id: ID!
        title: String!
        content: String!
        createdAt: String!
        updatedAt: String!
        userId: Int!
        user: User
    }

    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        status: String!
    }

    input userDataInput {
        name: String!
        email: String!
        password: String!
        confirmPassword: String!
    }

    input addPostData {
        title: String!
        content: String!
    }

    input editPostData {
        title: String
        content: String
    }

    type LoginData {
        message: String!
        token: String!
    }

    type DeletePost {
        message: String
    }

    type RootQuery {
        login(email: String!, password: String!) : LoginData!
        getPost(postId: ID!) : Post!
        getPosts(page: Int!) : [Post!]!
        getStatus : User!
    }

    type RootMutation {
        signup(userInput: userDataInput) : User!
        addPost(postData: addPostData!) : Post!
        editPost(postId: ID!, postData: editPostData!) : Post!
        deletePost(postId: ID!) : DeletePost
        editStatus(status: String!) : User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);