module.exports = {
  mockMessage: (options) => {
    return {
      content: options.content || 'default Content',
      reply: jest.fn(),
      channel: {
        send: jest.fn()
      },
      author: {
        username: options.author || 'testAuthor'
      },
      guild: {
        id: options.guild || 'testGuildID',
        roles: options.guild ? options.guild.roles : []
      },
      member: {
        hasPermission: jest.fn().mockReturnValue(options.member ? options.member.permission : false)
      }
    }
  }
}
