require('babel-register')
require('babel-polyfill')

var App = require('./src/app').default
App.start()