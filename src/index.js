const fs = require('fs')
const Discord = require('discord.js')
const log = require('./lib/utils/logger')
const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)

  client.commands.set(command.name, command)
}

const COMMAND_PREFIX = '!election '

client.on('ready', () => {
  log.info(`Logged in as ${client.user.tag}!`)
})

client.on('message', async msg => {
  if (!msg.content.startsWith(COMMAND_PREFIX) || msg.author.bot) return

  const args = msg.content.slice(COMMAND_PREFIX.length).split(/ +/)
  const commandName = args.shift().toLowerCase()

  if (commandName === 'stats') return msg.channel.send(client.guilds.size)

  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  if (command.guildOnly && msg.channel.type !== 'text') {
    return msg.reply('I can\'t execute that command inside DMs!')
  }

  try {
    command.execute(msg, args)
  } catch (error) {
    log.error(error)
    msg.reply('there was an error trying to execute that command!')
  }
})

client.login(process.env.DISCORD_BOT_TOKEN)
