import prettyjson from 'prettyjson'

var options = {
  noColor: false,
  keysColor: 'yellow'
}

export default (data, message) => {
	message = message || '\n'
	console.log(message)
	console.log(prettyjson.render(data, options))
	console.log('\n')
}