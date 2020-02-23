const mongoose = require('mongoose')

const nomineeSchema = new mongoose.Schema({
  username: { type: String },
  nominator: [{ type: String }],
  voters: [{ type: String }]
})

module.exports = nomineeSchema
