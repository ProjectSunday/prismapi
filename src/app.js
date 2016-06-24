import express 		from 'express'
import graphqlHTTP 	from 'express-graphql'
import cors			from 'cors'

import schema 				from '~/schema/schema'
import { connect }			from '~/backend/db'
import { Administrator } 	from '~/backend/meetup'

const PORT = process.env.PORT || 9000

const createApp = () => new Promise((resolve, reject) => {
	var app = express()

	app.use('/graphql', cors(), graphqlHTTP((req, res) => {
		return {
			schema,
			graphiql: true
		}
	}))

	var listener = app.listen(PORT, () => {
	    console.log(`=====> Prism API Server Online.  Port: ${PORT}.  Environment: BLAH`)
		resolve(listener)
	})

})


export default async () => {
	await connect()

	var app = await createApp()

	var administrator = new Administrator()
	await administrator.startTokenMonitoring()

	return app
}
