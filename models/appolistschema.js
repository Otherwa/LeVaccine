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
    date: {
        type: String,
        required: true
    }
}, {
    versionKey: false //here
})

module.exports = mongoose.model('appontmentslist', appolist)