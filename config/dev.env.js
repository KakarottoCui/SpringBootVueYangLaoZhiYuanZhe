'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./pro.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"dev"',
  BASE_API: '"http://127.0.0.1:9006/"',
  PROXY_URL: '"http://127.0.0.1:9006/"'
})
