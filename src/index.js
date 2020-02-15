const Discord = require('discord.js')
const bunyan = require('bunyan')
const R = require('ramda')
const campaign = require('./lib/campaign')
const client = new Discord.Client()

const log = bunyan.createLogger({ name: 'ElectionBot/main' })

client.on('ready', () => {
  log.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  if (msg.content.startsWith('!election_campaign ')) {
    const params = msg.content.split(' ')

    if (params[1] === 'status' || params[1] === 'current') {
      // fetch the current campaign
      const latestCampaign = await campaign.getCurrentCampaign()
      log.info(latestCampaign.isActive)
      if (R.isNil(latestCampaign) || !latestCampaign.isActive) {
        return msg.channel.send('There are no current campaign! please create one!')
      }

      return msg.channel.send(latestCampaign.toString())
    } else if (params[1] === 'create') {
      // validate params
      const name = params[2]
      const roleTitle = params[3]
      const openRoleCount = params[4]
      const nominationSlot = params[5]
      const nominationPeriod = new Date(params[6])
      const votingPeriod = new Date(params[7])
      await campaign.createCampaign({
        name,
        roleTitle,
        openRoleCount,
        nominationSlot,
        nominationPeriod,
        votingPeriod
      })

      return msg.channel.send('create campaign call received')
    }

    await msg.channel.send('pong')
  }

  if (msg.content.startsWith('!election_nominate ')) {
    // fetch the current campaign

    // check if sender can
  }

  if (msg.content.startsWith('!election_vote ')) {
    await msg.channel.send('pong')
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
