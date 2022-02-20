const { gql } = require("apollo-server");

module.exports =  gql`
type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
}
type Like {
    id: ID!
    createdAt: String!
    username: String!
}
type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
}
type User {
    id: ID!
    email: String!
    username: String!
    token: String!
    createdAt: String!
}
input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
}
type Query {
    posts: [Post]
    post(postId: ID!): Post
}
type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!

    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
}
`