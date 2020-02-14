require('dotenv').config()
const bunyan = require('bunyan')
const mongoose = require('mongoose')
const MONGO_DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27018/election-bot'
const CampaignSchema = require('./models/campaign')

mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', err => {
  log.fatal('Error connecting to DB :' + err)
  log.fatal('exiting process')
  process.exit()
})

mongoose.connection.once('connected', () => log.info('Database connection successful'))

const log = bunyan.createLogger({ name: 'ElectionBot/db' })

async function fetchLatestCampaign () {
  const allCampaign = await CampaignSchema.find().sort({ createdAt: -1 }).exec()
  return allCampaign[0]
}

async function createCampaign (campaign) {
  const campaignToInsert = new CampaignSchema(campaign)

  // save model to database
  await campaignToInsert.save()
}

module.exports = {
  fetchLatestCampaign,
  createCampaign
}
