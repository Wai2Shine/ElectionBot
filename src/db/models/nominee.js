const mongoose = require('mongoose')

const nomineeSchema = new mongoose.Schema({
  nominator: [{ type: String }],
  voters: [{ type: String }]
})

module.exports = nomineeSchema
