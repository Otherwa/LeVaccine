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
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mail: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    // recovery: {
    //     type: String,
    //     required: true,
    // }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('users', userSchema)