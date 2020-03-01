const moment = require('moment')
const Helper = require('../../__fixtures__/helper')
const campaign = require('../../src/commands/campaign')
const { getCurrentCampaign, createCampaign, cancelCurrentCampaign } = require('../../src/lib/campaign')

jest.mock('../../src/lib/campaign.js', () => ({
  getCurrentCampaign: jest.fn(),
  createCampaign: jest.fn(),
  cancelCurrentCampaign: jest.fn()
}))

const firstNominee = {
  username: 'shine2lay',
  nominators: ['bob', 'john'],
  voters: ['bob', 'john', 'smith']
}
const secondNominee = {
  username: 'shine2lay',
  nominators: ['bobby'],
  voters: ['bobby', 'johnny']
}
const currentPhase = 'Nomination Phase'
const testCampaign = {
  id: 'campaignId',
  name: 'testCampaign',
  creator: 'shine2lay',
  guildID: '123',
  targetRole: 'testRole',
  openRoleCount: 1,
  nominationSlot: 2,
  nominationPeriod: moment(1583506208939),
  votingPeriod: moment(1583606208939),
  nominees: [firstNominee, secondNominee],
  isActive: true,
  currentPhase
}

describe('campaign : status command Unit Test', () => {
  const msg = Helper.mockMessage({})
  const args = ['status']
  const expectedError = 'There are no current campaign! please create one!'

  beforeEach(() => {
    msg.channel.send.mockClear()
  })

  test('display the correct status message based on current campaign in Nomination Phase ', async () => {
    getCurrentCampaign.mockReturnValueOnce(testCampaign)

    const expectedEmbed = {
      author: {
        name: 'Election Bot'
      },
      color: 39423,
      description: `Currently in : ${currentPhase} \n This Phase will end ${moment(testCampaign.nominationPeriod).fromNow()}`
    }
    const expectedFields = {
      value: `Role to confer : ${testCampaign.targetRole}
        Number of open role: ${testCampaign.openRoleCount}
        Number of nominee slot: ${testCampaign.nominationSlot}
        Nomination Period will end at : ${moment(testCampaign.nominationPeriod)}
        Voting Period will end at : ${moment(testCampaign.votingPeriod)}
        Campaign Created by ${testCampaign.creator}`
    }

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0].embed).toEqual(
      expect.objectContaining(expectedEmbed)
    )
    expect(msg.channel.send.mock.calls[1][0].embed.fields[0]).toEqual(
      expect.objectContaining(expectedFields)
    )
  })

  test('display the correct status message based on current campaign in Voting Phase ', async () => {
    getCurrentCampaign.mockReturnValueOnce(testCampaign)

    const currentPhase = 'Voting Phase'
    testCampaign.currentPhase = currentPhase

    const expectedEmbed = {
      author: {
        name: 'Election Bot'
      },
      color: 39423,
      description: `Currently in : ${currentPhase} \n This Phase will end ${moment(testCampaign.votingPeriod).fromNow()}`
    }
    const expectedFields = {
      value: `Role to confer : ${testCampaign.targetRole}
        Number of open role: ${testCampaign.openRoleCount}
        Number of nominee slot: ${testCampaign.nominationSlot}
        Nomination Period will end at : ${moment(testCampaign.nominationPeriod)}
        Voting Period will end at : ${moment(testCampaign.votingPeriod)}
        Campaign Created by ${testCampaign.creator}`
    }

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0].embed).toEqual(
      expect.objectContaining(expectedEmbed)
    )
    expect(msg.channel.send.mock.calls[1][0].embed.fields[0]).toEqual(
      expect.objectContaining(expectedFields)
    )
  })

  test('error is returned if no current campaign exists', async () => {
    getCurrentCampaign.mockReturnValueOnce()

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toEqual(expectedError)
  })
  test('error if latest campaign is no longer active', async () => {
    getCurrentCampaign.mockReturnValueOnce(Object.assign({}, testCampaign, { isActive: false }))

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toEqual(expectedError)
  })
})

describe('campaign : create command Unit Test', () => {
  const msg = Helper.mockMessage({
    member: {
      permission: true
    },
    guild: {
      roles: [{ name: testCampaign.targetRole }]
    }
  })

  const args = [
    'create',
    testCampaign.name,
    testCampaign.targetRole,
    testCampaign.openRoleCount.toString(),
    testCampaign.nominationSlot.toString(),
    '1',
    '1']

  const expectedError = 'There is an existing campaign on going please use !election campaign status to get info on current campaign'

  beforeEach(() => {
    msg.channel.send.mockClear()
    msg.reply.mockClear()
    createCampaign.mockClear()
  })

  test('that creatCampaign is called if all parameters are valid', async () => {
    await campaign.execute(msg, args)

    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toBe('create campaign successful')
    expect(createCampaign.mock.calls.length).toBe(1)
    expect(createCampaign.mock.calls[0][0]).toEqual(expect.objectContaining({
      name: testCampaign.name,
      targetRole: testCampaign.targetRole,
      nominationSlot: testCampaign.nominationSlot.toString(),
      openRoleCount: testCampaign.openRoleCount.toString(),
      creator: msg.author.username
    }))
    expect(createCampaign.mock.calls[0][0].votingPeriod > createCampaign.mock.calls[0][0].nominationPeriod).toBe(true)
  })
  test('error is returned if current campaign exists', async () => {
    getCurrentCampaign.mockReturnValueOnce({ isActive: true })

    await campaign.execute(msg, args)

    expect(msg.channel.send.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls.length).toEqual(1)
    expect(msg.reply.mock.calls[0][0]).toEqual(expectedError)
  })
  test('error if arg length is not expected amount', async () => {
    getCurrentCampaign.mockReturnValueOnce()

    const args = [
      'create',
      testCampaign.name,
      testCampaign.targetRole,
      testCampaign.openRoleCount.toString(),
      testCampaign.nominationSlot.toString(),
      '1']

    const expectedError = 'Wrong format provided. please refer to "!election help" for general info and usage patterns'

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls.length).toEqual(1)
    expect(msg.reply.mock.calls[0][0]).toEqual(expectedError)
  })
  test('error if parameter validation fails : nominee slot higher than role count', async () => {
    const argsToTest = [...args]
    argsToTest[4] = (testCampaign.openRoleCount - 1).toString()

    const errorMsg = 'Number of Nominee Slots can\'t be lower than number of Open Roles'
    await campaign.execute(msg, argsToTest)

    expect(msg.channel.send.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls[0][0].includes(errorMsg)).toBe(true)
  })

  test('error if parameter validation fails : roleTitle Not valid', async () => {
    const argsToTest = [...args]
    argsToTest[2] = 'nonValid Role Title'

    const errorMsg = 'Role title provided is not valid'
    await campaign.execute(msg, argsToTest)

    expect(msg.channel.send.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls[0][0].includes(errorMsg)).toBe(true)
  })

  test('error if parameter validation fails : author is not an admin', async () => {
    const msg = Helper.mockMessage({
      member: {
        permission: false
      },
      guild: {
        roles: [{ name: testCampaign.targetRole }]
      }
    })

    const errorMsg = 'Only an administrator can set up a campaign'
    await campaign.execute(msg, args)

    expect(msg.channel.send.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls[0][0].includes(errorMsg)).toBe(true)
  })
})

describe('campaign : cancel command Unit Test', () => {
  const msg = Helper.mockMessage({})
  const args = ['cancel']

  const expectedError = 'There are no current campaign! please create one!'

  beforeEach(() => {
    msg.channel.send.mockClear()
    cancelCurrentCampaign.mockClear()
  })

  test('that cancel current campaign is called properly', async () => {
    getCurrentCampaign.mockReturnValueOnce(testCampaign)

    const expectedSuccessMsg = 'Cancellation of current campaign was successful'

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toEqual(expectedSuccessMsg)
    expect(cancelCurrentCampaign.mock.calls.length).toBe(1)
    expect(cancelCurrentCampaign.mock.calls[0][0]).toBe(testCampaign.id)
  })

  test('error is returned if no current campaign exists', async () => {
    getCurrentCampaign.mockReturnValueOnce()

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toEqual(expectedError)
    expect(cancelCurrentCampaign.mock.calls.length).toBe(0)
  })
  test('error if latest campaign is no longer active', async () => {
    getCurrentCampaign.mockReturnValueOnce(Object.assign({}, testCampaign, { isActive: false }))

    await campaign.execute(msg, args)
    expect(msg.channel.send.mock.calls.length).toBe(2)
    expect(msg.channel.send.mock.calls[1][0]).toEqual(expectedError)
    expect(cancelCurrentCampaign.mock.calls.length).toBe(0)
  })
})

describe('campaign : unknown sub-command Unit Test', () => {
  const msg = Helper.mockMessage({})
  const args = ['unknown']

  const expectedError = 'Unknown Sub Command provided, please use "!election help" to see usage guide'

  beforeEach(() => {
    msg.reply.mockClear()
  })

  test('proper error is reply to the sender', async () => {
    getCurrentCampaign.mockReturnValueOnce(testCampaign)

    await campaign.execute(msg, args)
    expect(msg.reply.mock.calls.length).toBe(1)
    expect(msg.reply.mock.calls[0][0]).toEqual(expectedError)
  })
})
