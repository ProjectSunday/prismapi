import express 		from 'express'
import graphqlHTTP 	from 'express-graphql'
import cors			from 'cors'

import schema from './schema'
import { connect } from './db'

const port = process.env.PORT || 9000

export default new Promise((resolve, reject) => {
	connect().then(() => {
		var app = express()

		// app.use(function(req, res, next) {
		//   res.header("Access-Control-Allow-Origin", "*")
		//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		//   next();
		// })


		app.use('/graphql', cors(), graphqlHTTP((req, res) => {
			// console.log('some reqest', req.query)
			return {
				schema,
				graphiql: true
			}
		}))

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
