const mongoose = require('mongoose');

// indexes username and email

const schema = mongoose.Schema;
const userSchema = new schema({
    username: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('users', userSchema)