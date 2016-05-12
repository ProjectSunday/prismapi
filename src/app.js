import express from 'express'
import graphqlHTTP from 'express-graphql'

import schema from './schema'

let app = express()
const port = process.env.PORT || 9000

app.use('/graphql', graphqlHTTP((req, res) => ({
	schema,
	graphiql: true
})))


// if (!MOCHA_TESTING) {   //require for mocha to not fuck up, DO NOT DELETE!


// }

var server

module.exports = {
	start: () => {
		console.log('starting')
		server = app.listen(port, function () {
			console.log('=============================================================')
		    console.log(`Prism API server online.  Port: ${port}. Environment: BLAH`)
			console.log('=============================================================')
		})

		return server
	},
	stop: () => {
		console.log('stopping')
		server.close()
	}
}

