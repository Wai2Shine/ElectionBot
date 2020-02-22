const Campaign = require('../lib/campaign')
const R = require('ramda')
const bunyan = require('bunyan')
const moment = require('moment')
const log = bunyan.createLogger({name: 'Electionbot/command/campaign'})

async function validateParameters(msg, campaign) {
  const errors = []

  if(campaign.nominationSlot < campaign.openRoleCount) {
    errors.push(`Number of Nominee Slots can't be lower than number of Open Roles`)
  }

  if(!msg.guild.roles.find(role => role.name === campaign.name)) {
    errors.push('Role title provided is not valid')
  }

  if(!msg.member.hasPermission(['ADMINISTRATOR'])) {
    errors.push('Only an administrator can set up a campaign')
  }

  return errors
}

module.exports = {
  name: 'campaign',
  description: 'Create or Check current campaign',
  usage: `<create> <role>`,
  guildOnly: true,
  async execute(msg, args) {
    if (args[0] === 'status' || args[1] === 'current') {
      // fetch the current campaign
      const latestCampaign = await Campaign.getCurrentCampaign()

      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      return msg.channel.send(latestCampaign.toString())
    } else if (args[0] === 'create') {
      if (args.length !== 7) msg.reply('Wrong format provided.')

      const campaignToCreate = {
        name : args[1],
        targetRole : args[2],
        openRoleCount: args[3],
        nominationSlot: args[4],
        nominationPeriod: moment().add(args[5], 'days' ),
        votingPeriod: moment().add((Number(args[5]) + Number(args[6])), 'days' ),
        creator: msg.author.username,
        guildID: msg.guild.id
      }

      const errors = await validateParameters(msg, campaignToCreate)

      if(errors.length !== 0) {
        return msg.reply(`Following Error were found while validating the parameters : \n- ${errors.join('\n- ')}`)
      }

      await Campaign.createCampaign(campaignToCreate)

      return msg.channel.send('create campaign successful')
    }
  }
}