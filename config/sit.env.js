'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"sit"',
  BASE_API: '"https://www.skywalking.pro/admin-api/common-platform-api/"'
})
