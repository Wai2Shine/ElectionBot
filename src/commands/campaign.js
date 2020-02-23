const Campaign = require('../lib/campaign')
const R = require('ramda')
const bunyan = require('bunyan')
const moment = require('moment')
const log = bunyan.createLogger({ name: 'Electionbot/command/campaign' })

async function validateParameters (msg, campaign) {
  const errors = []

  if (campaign.nominationSlot < campaign.openRoleCount) {
    errors.push('Number of Nominee Slots can\'t be lower than number of Open Roles')
  }

  if (!msg.guild.roles.find(role => role.name === campaign.targetRole)) {
    errors.push('Role title provided is not valid')
  }

  if (!msg.member.hasPermission(['ADMINISTRATOR'])) {
    errors.push('Only an administrator can set up a campaign')
  }

  return errors
}

function craftStatusMessage (campaign) {
  const currentPhase = campaign.currentPhase

  let sortedNominees, nominees, phaseEnd

  if (currentPhase === 'Nomination Phase') {
    phaseEnd = campaign.nominationPeriod
    sortedNominees = campaign.nominees.sort((a,b) => b.nominators.length - a.nominators.length)
    nominees = sortedNominees.map(nominee => `${nominee.username}\t ${nominee.nominators.length}`)
  } else {
    phaseEnd = campaign.nominationPeriod
    sortedNominees = campaign.nominees.sort((a,b) => b.voters.length - a.voters.length)
    nominees = sortedNominees.map(nominee => `${nominee.username}\t ${nominee.voters.length}`)
  }

  return {
    color: 0x0099ff,
    title: 'Current Campaign',
    author: {
      name: 'Election Bot'
    },
    description: `Currently in : ${currentPhase} \n This Phase will end ${moment(phaseEnd).fromNow()}`,
    fields: [
      {
        name: 'Parameters of current campaign',
        value: `Role to confer : ${campaign.targetRole}
        Number of open role: ${campaign.openRoleCount}
        Number of nominee slot: ${campaign.nominationSlot}
        Nomination Period will end at : ${moment(campaign.nominationPeriod)}
        Voting Period will end at : ${moment(campaign.votingPeriod)}
        Campaign Created by ${campaign.creator}`
      },
      {
        name: 'Nominees and vote count',
        value: `${nominees.join('\n')}`
      }
    ],
    timestamp: new Date(),
    footer: {
      text: 'Some footer text here',
      icon_url: 'https://i.imgur.com/wSTFkRM.png'
    }
  }
}

module.exports = {
  name: 'campaign',
  description: 'Create or Check current campaign',
  usage: '<create> <role>',
  guildOnly: true,
  async execute (msg, args) {
    log.info('Campaign command received', msg.guild.id, 'args: ', args)
    msg.channel.send('campaign call received')
    if (args[0] === 'status' || args[1] === 'current') {
      // fetch the current campaign
      const latestCampaign = await Campaign.getCurrentCampaign(msg.guild.id)

      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      return msg.channel.send({ embed: craftStatusMessage(latestCampaign) })
    } else if (args[0] === 'create') {
      const latestCampaign = await Campaign.getCurrentCampaign(msg.guild.id)

      if (!R.isNil(latestCampaign) && latestCampaign.isActive) {
        return msg.reply('There is an existing campaign on going please use !election campaign status to get info on current campaign')
      }

      if (args.length !== 7) msg.reply('Wrong format provided. please refer to !election help for general info and usage patterns')

      const campaignToCreate = {
        name: args[1],
        targetRole: args[2],
        openRoleCount: args[3],
        nominationSlot: args[4],
        nominationPeriod: moment().add(args[5], 'days'),
        votingPeriod: moment().add((Number(args[5]) + Number(args[6])), 'days'),
        creator: msg.author.username,
        guildID: msg.guild.id
      }

      const errors = await validateParameters(msg, campaignToCreate)

      if (errors.length !== 0) {
        return msg.reply(`Following Error were found while validating the parameters : \n- ${errors.join('\n- ')}`)
      }

      await Campaign.createCampaign(campaignToCreate)

      return msg.channel.send('create campaign successful')
    } else if (args[0] === 'cancel') {
      const latestCampaign = await Campaign.getCurrentCampaign(msg.guild.id)

      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      await Campaign.cancelCurrentCampaign(latestCampaign.id)
      return msg.channel.send('Cancellation of current campaign was successful')
    }
  }
}
