const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const details = new schema({
    adhar: {
        type: String,
        default: ' ',
        required: true

    },
    ngo: {
        type: String,
        default: ' ',
        required: true
    },
    ngoaddress: {
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

const order = new schema({
    prodid: {
        type: ObjectId,
        required: true
    },
    proid: {
        type: ObjectId,
        required: true
    },
    stonkid: {
        type: ObjectId,
        required: true
    },
    details: {
        type: details,
        required: true
    },
    vaccinecode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: false,
    },
    stock: {
        type: Number,
        default: 1,
    },
    date: {
        type: String,
        required: true,
    }
}, {
    versionKey: false, //here
    timestamps: true
})

module.exports = mongoose.model('order', order)