const mongoose = require('mongoose');

// indexes username and email

const schema = mongoose.Schema;
const providerschema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    authentication: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('provider', providerschema)