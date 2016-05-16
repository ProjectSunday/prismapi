import express from 'express'
import graphqlHTTP from 'express-graphql'


import mongo from './mongo'


import schema from './schema'

let app = express()
const port = process.env.PORT || 9000

app.use('/graphql', graphqlHTTP((req, res) => ({
	schema,
	graphiql: true
})))

if (!MOCHA_TESTING) {   //require for mocha to not fuck up, DO NOT DELETE!

	app.listen(port, function () {
		console.log('=============================================================')
	    console.log(`Prism API server online.  Port: ${port}. Environment: BLAH`)
		console.log('=============================================================')
	})

}


export default (testing) => {

	return new Promise((resolve, reject) => {

		Database.connect().then(() => {

		})

	})

}


module.exports = app


var upArrow = $('lskjdflskjdfsdf')

upArrow.on('click', function () {

})


