require('babel-register')
require('babel-polyfill')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	require('./debug')
}

require('./src/app').default.start()
