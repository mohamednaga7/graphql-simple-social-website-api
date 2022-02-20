const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: Date
});

module.exports = model('User', userSchema);