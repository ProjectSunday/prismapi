import express 		from 'express'
import graphqlHTTP 	from 'express-graphql'
import cors			from 'cors'

import schema from '~/schema/schema'
import { connect } from '~/data/data'

const port = process.env.PORT || 9000

export default new Promise((resolve, reject) => {
	connect().then(() => {
		var app = express()

		app.use('/graphql', cors(), graphqlHTTP((req, res) => {
			return {
				schema,
				graphiql: true
			}
		}))

		var listener = app.listen(port, () => {
		    console.log(`=====> Prism API Server Online.  Port: ${port}.  Environment: BLAH`)
			resolve(listener)
		})

	}, error => {
		console.error('Prism API server cannot connect to database.  Aborting...')
		console.error(error)
		reject(error)
	})

})
