const mangoose = require('mongoose');

const UserSchema = new mangoose.Schema({
    name: String,
    email: String,
    password: String,
    image: String,
    mobile: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = mangoose.model('users', UserSchema);