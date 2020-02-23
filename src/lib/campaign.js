const db = require('../db')

const nominees = []
nominees.push({ username: 'shine2lay', nominators: ['waiDumbass', 'wie'] })
nominees.push({ username: 'keelee', nominators: ['waiDumbass', 'wss', 'wie'] })

module.exports = {
  createCampaign: async (campaign) => {
    return db.createCampaign(
      Object.assign(
        {},
        campaign,
        { createdAt: Date.now(), updatedAt: Date.now(), nominees }))
  },
  getCurrentCampaign: async (guildId) => {
    return db.fetchLatestCampaignByGuildId(guildId)
  },
  cancelCurrentCampaign: async (id) => {
    return db.cancelCampaign(id)
  }
}
