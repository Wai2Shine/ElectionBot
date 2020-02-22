const bunyan = require('bunyan')
const log = bunyan.createLogger({ name: 'Electionbot/command/help' })

module.exports = {
  name: 'help',
  description: 'General information about the app and the usage patterns',
  usage: '<create> <role>',
  guildOnly: true,
  alias: ['usage'],
  async execute (msg, args) {
    log.info('Help Command Received', msg.guild.id)
    const helpEmbedMessage = {
      color: 0x0099ff,
      title: 'Election Bot',
      url: 'https://discord.js.org',
      author: {
        name: 'Shine Lee',
        icon_url: 'https://i.imgur.com/wSTFkRM.png',
        url: 'https://discord.js.org'
      },
      description: 'Hold election to give community member permission over the server',
      thumbnail: {
        url: 'https://i.imgur.com/wSTFkRM.png'
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

    return msg.channel.send({ embed: helpEmbedMessage })
  }
}
