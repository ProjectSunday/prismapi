require('babel-register')({
	ignore: false,
	stage: 0
})
require('babel-polyfill')
var app = require('./src/app')
