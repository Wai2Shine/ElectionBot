const mongoose = require('mongoose')

const nomineeSchema = new mongoose.Schema({
  username: { type: String, required: true },
  nominators: {
    type: [String],
    default: []
  },
  voters: {
    type: [String],
    default: []
  }
})

module.exports = nomineeSchema
