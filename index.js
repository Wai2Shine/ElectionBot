const Discord = require('discord.js')
const bunyan = require('bunyan')
const client = new Discord.Client()

const log = bunyan.createLogger({ name: 'ElectionBot' })

client.on('ready', () => {
  log.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong')
  }
})

client.login('Njc1ODI4Mzg4ODI0NjEyODg1.Xj80bg.p6Rhkqd7AhBa29t6ReIdVrdf2PM')
