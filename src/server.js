import express from 'express'
import graphqlHTTP from 'express-graphql'

// import mongo from './mongo'

import schema from './schema'

import db from './db'



// console.log('db before', db)

// db.then(() => {
// 	console.log('db after', db)
// })

// let app = express()
const port = process.env.PORT || 9000

// app.use('/graphql', graphqlHTTP((req, res) => ({
// 	schema,
// 	graphiql: true
// })))

// if (!MOCHA_TESTING) {   //require for mocha to not fuck up, DO NOT DELETE!

// 	app.listen(port, function () {
// 		console.log('=============================================================')
// 	    console.log(`Prism API server online.  Port: ${port}. Environment: BLAH`)
// 		console.log('=============================================================')
// 	})

// }

console.log('app invoked===========================================')

var server

const start => () = {
	return new Promise((resolve, reject) => {

		db.then(() => {

			var app = express()

			exp.use('/graphql', graphqlHTTP((req, res) => ({
				schema,
				graphiql: true
			})))

			server = exp.listen(port, () => {
				console.log('=============================================================')
			    console.log(`Prism API server online.  Port: ${port}. Environment: BLAH`)
				console.log('=============================================================')

				resolve(server)
			})


		}, () => {
			console.error('Prism API server cannot connect to database.  Aborting...')
			reject()
		})

})

const stop = () => {

	return new Promise((resolve, reject) => {
		server.close(() => {
			resolve()
		}
	})
	return 
}


export default { start, stop }



