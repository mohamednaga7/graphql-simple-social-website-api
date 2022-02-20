if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({path: '.env.local' })
}
const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const config = require('./config');
const Post = require('./models/Post');

const typeDefs = require('./graphql/typeDefs');
const posts = require('./graphql/resolvers/posts');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
})

mongoose.connect(config.MONGODB_URL).then(() => {
    server.listen(4000).then((res) => { console.log(`Server is running at ${res.url}`) });
})
