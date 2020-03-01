module.exports = {
  testEnvironment: 'node',
  coverageDirectory: './coverage/',
  coveragePathIgnorePatterns: [
    'src/db/models/*.js',
    'src/lib/utils/logger.js',
    '__fixtures__/helper.js'
  ]
}
