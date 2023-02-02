const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const schema = mongoose.Schema;

const appolist = new schema({
    appoid: {
        type: ObjectId,
        required: true
    },
    userid: {
        type: ObjectId,
        required: true
    },
    status: {
        type: Boolean,
        default: false,
    },
    date: {
        type: String,
        required: true,
    }
}, {
    versionKey: false, //here
    timestamps: true
})

module.exports = mongoose.model('appointmentslist', appolist)