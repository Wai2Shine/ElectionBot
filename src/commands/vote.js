const R = require('ramda')
const log = require('../lib/utils/logger')
const Campaign = require('../lib/campaign')

function checkCampaignStatus (campaign) {
  if (R.isNil(campaign) || !campaign.isActive) {
    return 'There are no current campaign! please create one!'
  }

  if (campaign.currentPhase !== 'Voting Phase') {
    return 'Current Campaign is not in no yet in Voting Phase! please use "!election campaign status" to get status on current campaign'
  }
}

module.exports = {
  name: 'vote',
  description: 'vote for one of the nominee available',
  usage: '<create> <role>',
  guildOnly: true,
  async execute (msg, args) {
    log.info('vote command received', msg.guild.id, 'args: ', args)
    msg.channel.send('vote call received')

    const currentCampaign = await Campaign.getCurrentCampaign(msg.guild.id)
    const campaignStatusError = checkCampaignStatus(currentCampaign)
    if (!R.isNil(campaignStatusError)) return msg.channel.send(campaignStatusError)

    if (currentCampaign.voted.find(nominations => nominations === msg.author.username)) {
      return msg.reply('You can only nominate one person for the role, our records indicate you have already nominated someone for the campaign!')
    }

    // accept nomination and add it to db
    currentCampaign.voted.push(msg.author.username)
    const nominee = currentCampaign.nominees.find(nominee => nominee.name === args[0])

    if (R.isNil(nominee)) {
      return msg.channel.send('This person did not receive any nomination so they are not eligible for voting')
    }

    nominee.voters.push(msg.author.username)

    await currentCampaign.save()

    return msg.channel.send('Nomination accepted')
  }
}
