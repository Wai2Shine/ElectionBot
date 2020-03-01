const campaign = require('../../src/lib/campaign')

jest.mock('../../src/db/index.js', () => ({
  createCampaign: jest.fn(),
  fetchLatestCampaignByGuildId: jest.fn(),
  cancelCampaign: jest.fn()
}))

describe('campaign lib : createCampaign Unit Test', () => {
  beforeEach(() => {
  })

  test('that creatCampaign is called if all parameters are valid', async () => {
  })
})

describe('campaign lib : getCurrentCampaign Unit Test', () => {
  beforeEach(() => {
  })

  test('that creatCampaign is called if all parameters are valid', async () => {
  })
})

describe('campaign lib : cancelCurrentCampaign Unit Test', () => {
  beforeEach(() => {

  })

  test('that creatCampaign is called if all parameters are valid', async () => {

  })
})
