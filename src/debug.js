import prettyjson from 'prettyjson'

var options = {
  noColor: false,
  keysColor: 'yellow'
}

export const log = (data, message) => {
	message = message || '\n'
	console.log(message)
	console.log(prettyjson.render(data, options))
	console.log('\n')
}