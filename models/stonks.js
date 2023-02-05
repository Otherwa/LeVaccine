const mongoose = require('mongoose');
const schema = mongoose.Schema;

const stonk = new schema({
    prodid: {
        required: true,
        type: 'ObjectId',
    },
    vaccine: {
        required: true,
        type: 'string',
    },
    vaccinecode: {
        required: true,
        type: 'string',
    },
    description: {
        required: true,
        type: 'string',
    },
    effectiveness: {
        required: true,
        type: 'string',
    },
    stocks: {
        required: true,
        type: 'Number',
    }
    ,
    against: {
        required: true,
        type: 'string',
    }
}, {
    versionKey: false, //here
    timestamps: true
})

module.exports = mongoose.model('stonk', stonk);

