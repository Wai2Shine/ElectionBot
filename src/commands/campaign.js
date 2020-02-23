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
  return {
    color: 0x0099ff,
    title: 'Current Campaign',
    author: {
      name: 'Election Bot'
      // icon_url: 'https://i.imgur.com/wSTFkRM.png',
      // url: 'https://discord.js.org'
    },
    description: 'Hold election to give community member permission over the server',
    thumbnail: {
      // url: 'https://i.imgur.com/wSTFkRM.png'
    },
    fields: [
      {
        name: '\u200b',
        value: '\u200b'
      },
      {
        name: 'How this works',
        value: 'Before a campaign is created, an admin to create a role to which the community member will be voting for' +
          'Then an admin will create a campaign which will trigger the nomination phase. \n During nomination phase, the community' +
          'members can each nominate one person for the role. After the nomination period ends, the top # of nominee will be eligible to be voted' +
          'into the role when the voting period starts'
      },
      {
        name: 'Usage Guide',
        value: `!election help : bring up this very helpful information panel 
            
            !election campaign : Create/Cancel a campaign or see the status of current campaign       
            
            !election nominate : Nominate a fellow member for the role during the nomination Period
            
            !election vote : Vote for the one of the possible nominee during the Voting Phase`
      },
      {
        name: '\u200b',
        value: '\u200b'
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
      },
      {
        name: 'Inline field title',
        value: 'Some value here',
        inline: true
      }
    ],
    image: {
      url: 'https://i.imgur.com/wSTFkRM.png'
    },
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
      const latestCampaign = await Campaign.getCurrentCampaign()

      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      return msg.channel.send({ embed: craftStatusMessage(latestCampaign) })
    } else if (args[0] === 'create') {
      const latestCampaign = await Campaign.getCurrentCampaign()

      if (!R.isNil(latestCampaign) && latestCampaign.isActive) {
        return msg.reply.send('There is an existing campaign on going please use !election campaign status to get info on current campaign')
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
      const latestCampaign = await Campaign.getCurrentCampaign()

      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      await Campaign.cancelCurrentCampaign(latestCampaign.id)
      return msg.channel.send('Cancellation of current campaign was successful')
    }
  }
}
