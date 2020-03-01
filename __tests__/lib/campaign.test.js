const moment = require('moment')
const campaign = require('../../src/lib/campaign')
const { createCampaign, fetchLatestCampaignByGuildId, cancelCampaign } = require('../../src/db')

jest.mock('../../src/db/index.js', () => ({
  createCampaign: jest.fn(),
  fetchLatestCampaignByGuildId: jest.fn(),
  cancelCampaign: jest.fn()
}))

const testCampaign = {
  id: 'campaignId',
  name: 'testCampaign',
  creator: 'shine2lay',
  guildID: '123',
  targetRole: 'testRole',
  openRoleCount: 1,
  nominationSlot: 2,
  nominationPeriod: moment(1583506208939),
  votingPeriod: moment(1583606208939)
}

describe('campaign lib : createCampaign Unit Test', () => {
  beforeEach(() => {
    createCampaign.mockClear()
  })

  test('that creatCampaign function is invoked with proper parameter', async () => {
    await campaign.createCampaign(testCampaign)

    expect(createCampaign.mock.calls.length).toBe(1)
    expect(createCampaign.mock.calls[0][0].createdAt).toBeDefined()
    expect(createCampaign.mock.calls[0][0].updatedAt).toBeDefined()
    expect(createCampaign.mock.calls[0][0].nominees).toEqual([])
  })
})

describe('campaign lib : getCurrentCampaign Unit Test', () => {
  beforeEach(() => {
    fetchLatestCampaignByGuildId.mockClear()
  })

  test('that fetchLatestCampaignByGuildId is invoked', async () => {
    await campaign.getCurrentCampaign(testCampaign.guildID)

    expect(fetchLatestCampaignByGuildId.mock.calls.length).toBe(1)
    expect(fetchLatestCampaignByGuildId.mock.calls[0][0]).toBe(testCampaign.guildID)
  })
})

describe('campaign lib : cancelCurrentCampaign Unit Test', () => {
  beforeEach(() => {
    cancelCampaign.mockClear()
  })

  test('that cancelcampign function invoked with the id', async () => {
    await campaign.cancelCurrentCampaign(testCampaign.guildID)

    expect(cancelCampaign.mock.calls.length).toBe(1)
    expect(cancelCampaign.mock.calls[0][0]).toBe(testCampaign.guildID)
  })
})
