const db = require('../db')

module.exports = {
  createCampaign: async (campaign) => {
    return db.createCampaign(
      Object.assign(
        {},
        campaign,
        { createdAt: Date.now(), updatedAt: Date.now() }))
  },
  getCurrentCampaign: async () => {
    const latestCampaign = await db.fetchLatestCampaign()
    return latestCampaign
  },
}