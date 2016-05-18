import express 		from 'express'
import graphqlHTTP 	from 'express-graphql'

import schema from './schema'
import db from './db'

const port = process.env.PORT || 9000

export default new Promise((resolve, reject) => {
	db.then(() => {
		var app = express()

		app.use('/graphql', graphqlHTTP((req, res) => ({
			schema,
			graphiql: true
		})))

		var listener = app.listen(port, () => {
		    console.log(`=====> Prism API server online.  Port: ${port}. Environment: BLAH`)
			resolve(listener)
		})

	}, error => {
		console.error('Prism API server cannot connect to database.  Aborting...')
		console.error(error)
		reject(error)
	})

})
