const User = require('../../models/User');
const { sign } = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { hash, compare } = require('bcryptjs');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { UserInputError } = require('apollo-server');

const generateToken = (user) => {
    return sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, JWT_SECRET);
}

module.exports = {
	Query: {
		// users: () => [],
	},
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
			context
		) {
			// TODO Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
			// TODO make sure the user doesnt already exist
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                throw new UserInputError("this username / email already exist");
            }
			// TODO hash the password and create an auth token
            password = await hash(password, 12);
            const newUser = new User({
                email, username, password, createdAt: new Date().toISOString()
            });
            const res = await newUser.save();
            if (!res) throw new Error('no user found')

            const token = generateToken(res);
            
            return {
                ...res._doc,
                id: res._id,
                token,
            }
        },
        login: async (_, { username, password }) => {
            const { errors, valid } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors})
            }

            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
	},
};
