const mongoose = require('mongoose');
const schema = mongoose.Schema;

// indexes username and email
const name = new schema({
    firstname: {
        type: String,
        default: ' ',
        required: true
    },
    lastname: {
        type: String,
        default: ' ',
        required: true
    }

}, {
    versionKey: false //here
})

const details = new schema({
    adhar: {
        type: String,
        default: ' ',
        required: true

    },
    position: {
        type: [Number],
        default: [0, 0]
    },
    age: {
        type: String,
        default: ' ',
        required: true
    },
    address: {
        type: String,
        default: ' ',
        required: true
    },
    phone: {
        type: String,
        default: ' ',
        required: true
    },
    city: {
        type: String,
        default: ' ',
        required: true
    },
    gender: {
        type: String,
        default: ' ',
        required: true
    },
    region: {
        type: String,
        default: ' ',
        required: true
    },
    postcode: {
        type: String,
        default: ' ',
        required: true
    },
}, {
    versionKey: false //here
})

const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    name: {
        type: name,
        // required: true
    },
    detail: {
        type: details,
        // required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: name,
        // required: true
    },
    detail: {
        type: details,
        // required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    personstatus: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('user', userSchema)