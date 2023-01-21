const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');


const schema = mongoose.Schema;


const appodetails = new schema({
    time: {
        type: String,
        required: true
    },
    vaccine: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    position: {
        type: [Number],
        default: [0, 0]
    },
    slots: {
        type: Number,
        required: true
    }
}, {
    versionKey: false //here
})

const setapposchema = new schema({
    byappo: {
        type: ObjectId,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        default: false
    },
    postcode: {
        type: String,
        default: false
    },
    details: {
        type: appodetails,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('appontments', setapposchema)