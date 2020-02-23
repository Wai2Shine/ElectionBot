require('dotenv').config()
const mongoose = require('mongoose')
const log = require('../lib/utils/logger')
const MONGO_DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27018/election-bot'
const CampaignSchema = require('./models/campaign')

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

  mongoose.connection.on('error', err => {
    log.fatal('Error connecting to DB :' + err)
    log.fatal('exiting process')
    process.exit()
  })

  mongoose.connection.once('connected', () => log.info('Database connection successful'))
}

async function fetchLatestCampaignByGuildId (guildID) {
  const allCampaign = await CampaignSchema.find({ guildID }).sort({ createdAt: -1 }).exec()
  return allCampaign[0]
}

async function createCampaign (campaign) {
  const campaignToInsert = new CampaignSchema(campaign)

  // save model to database
  return campaignToInsert.save()
}

async function cancelCampaign (campaignId) {
  return CampaignSchema.updateOne({ _id: campaignId }, { isCancelled: true })
}

module.exports = {
  fetchLatestCampaignByGuildId,
  createCampaign,
  cancelCampaign
}
