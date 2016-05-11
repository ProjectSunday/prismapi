import express from 'express'
import graphqlHTTP from 'express-graphql'

import Schema from './schema'

let app = express()
const port = process.env.PORT || 9000

app.use('/graphql', graphqlHTTP((req, res) => ({
	schema: Schema,
	graphiql: true
})))

if (!MOCHA_TESTING) {   //require for mocha to not fuck up, DO NOT DELETE!

	app = app.listen(port, function () {
		console.log('\n')
		console.log('=============================================================')
	    console.log(`Prism API server online.  Port: ${port}. Environment: BLAH`)
		console.log('=============================================================')
		console.log('\n')
	})

}

module.exports = app

