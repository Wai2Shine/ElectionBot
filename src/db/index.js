require('dotenv').config
const bunyan = require('bunyan')
const mongoose = require('mongoose')
const MONGO_DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27018/election-bot'
const campaignSchema = require('./models/campaign')

mongoose.connect('mongodb://localhost:27018/election-bot', { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('error', err => {
  log.fatal('Error connecting to DB :' + err)
  log.fatal('exiting process')
  process.exit()
})

mongoose.connection.once('connected', () => log.info('Database connection successful'))

const log = bunyan.createLogger({ name: 'ElectionBot/db' })

async function fetchLatestCampaign () {
  const allCampaign = await campaignSchema.find().sort({ createdAt: -1 }).exec()
  return allCampaign[0]
}

async function createCampaign (campaign) {
  const campaignToInsert = new campaignSchema(campaign)

  // save model to database
  await campaignToInsert.save()
}

module.exports = {
  fetchLatestCampaign,
  createCampaign
}
