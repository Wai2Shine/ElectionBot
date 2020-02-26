const db = require('../db')

module.exports = {
  createCampaign: async (campaign) => {
    return db.createCampaign(
      Object.assign(
        {},
        campaign,
        { createdAt: Date.now(), updatedAt: Date.now(), nominees: [] }))
  },
  getCurrentCampaign: async (guildId) => {
    return db.fetchLatestCampaignByGuildId(guildId)
  },
  cancelCurrentCampaign: async (id) => {
    return db.cancelCampaign(id)
  }
}
