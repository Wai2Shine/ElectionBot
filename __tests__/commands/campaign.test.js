const Helper = require('../../__fixtures__/helper')
const campaign = require('../../src/commands/campaign')

jest.mock('../../src/lib/campaign.js', () => {
  return {
    getCurrentCampaign: jest.fn()
  }
})

describe('campaign command Unit Test', () => {
  test('that one + one is two', async () => {
    const msg = Helper.mockMessage({})
    const args = ['status']

    await campaign.execute(msg, args)
    expect(1 + 1).toEqual(2)
  })
})
