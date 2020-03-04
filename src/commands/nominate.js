const R = require('ramda')
const moment = require('moment')
const log = require('../lib/utils/logger')
const Campaign = require('../lib/campaign')

function checkCampaignStatus(campaign) {
  if (R.isNil(campaign) || !campaign.isActive) {
    return 'There are no current campaign! please create one!'
  }

  if (campaign.currentPhase !== 'Nomination Phase') {
    return 'Current Campaign is not in no longer in Nomination Phase! please use "!election campaign status" to get status on current campaign'
  }
}

module.exports = {
  name: 'nominate',
  description: 'Nominate a user within the guild for the role',
  usage: '<create> <role>',
  guildOnly: true,
  async execute (msg, args) {
    log.info('Nominate command received', msg.guild.id, 'args: ', args)
    msg.channel.send('nominate call received')

    const nomineeToNominate = msg.guild.members.find(member => member.user.username === args[0])

    if(R.isNil(nomineeToNominate)) return msg.reply('We were not able to find a user with this username')
    if(nomineeToNominate.user.bot) return msg.reply('You can not nominate a BOT')

    const currentCampaign = await Campaign.getCurrentCampaign(msg.guild.id)
    const campaignStatusError = checkCampaignStatus(currentCampaign)
    if (!R.isNil(campaignStatusError)) return msg.channel.send(campaignStatusError)

    if (currentCampaign.nominated.find(nominations => nominations === msg.author.username)) {
      return msg.reply('You can only nominate one person for the role, our records indicate you have already nominated someone for the campaign!')
    }

    // accept nomination and add it to db
    currentCampaign.nominated.push(msg.author.username)
    const nominee = currentCampaign.nominees.find(nominee => nominee.name === args[0])
    if (!R.isNil(nominee)) {
      nominee.nominators.push(msg.author.username)
    } else {
      currentCampaign.nominees.push({
        username: args[0],
        nominators: [msg.author.username],
        voters: []
      })
    }

    await currentCampaign.save()

    return msg.channel.send('Nomination accepted')
  }
}
