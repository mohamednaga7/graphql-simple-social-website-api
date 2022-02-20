const { AuthenticationError, UserInputError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
	Query: {
		posts: async () => {
			try {
				const posts = await Post.find().sort({createdAt: -1});
				return posts;
			} catch (e) {
				throw new Error(e);
			}
        },
        post: async (_, {postId}) => {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch (e) {
                throw new Error(e);
            }
        }
    },
    Mutation: {
        createPost: async (_, { body }, ctx) => {
            if (body.trim() === '') {
                throw new UserInputError("Post body must not be empty")
            }
            const user = checkAuth(ctx);
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save();

            return post;
        },
        deletePost: async (_, { postId }, ctx) => {
            const user = checkAuth(ctx);
            
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully'
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        likePost: async (_, { postId }, ctx) => {
            const { username } = checkAuth(ctx);

            const post = await Post.findById(postId);
            if (post) {
                if (post.likes.find(like => like.username === username)) {
                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
};
