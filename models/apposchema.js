const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { con } = require('../config/connection_config');

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
})

const setapposchema = new schema({
    byappo: {
        type: ObjectId,
        required: true
    },
    address: {
        unique: true,
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
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('appontments', setapposchema)