const mongoose = require('mongoose')
const nominee = require('./nominee')

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roleToGive: { type: String, required: true },
  OpenRoleCount: { type: Number, required: true },
  nominationSlot: Number,
  nominationPeriod: { type: Date, required: true },
  votingPeriod: { type: Date, required: true },
  nominees: { type: Map, of: nominee },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('campaign', campaignSchema)
