const mongoose = require('mongoose')
const schema = mongoose.Schema

const Email_schema = new schema(
  {
    email: {
      unique: true,
      required: true,
      type: 'string'
    },
    pos: { type: Array, default: [], required: true },
    date: {
      required: true,
      type: 'string'
    }
  },
  {
    versionKey: false // here
  }
)

module.exports = mongoose.model('subscribers', Email_schema)
