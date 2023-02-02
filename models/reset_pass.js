const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reset_otp = new schema({
    email: {
        required: true,
        type: 'string',
    },
    otp: {
        type: 'string',
    },
    date: {
        required: true,
        type: 'string',
    }
}, {
    versionKey: false, //here
    timestamps: true
})

module.exports = mongoose.model('resetotp', reset_otp);

