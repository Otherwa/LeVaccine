const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

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