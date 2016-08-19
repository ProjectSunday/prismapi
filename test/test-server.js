import supertest from 'supertest'

import App from '~/app'

const HEADERS = { 'Content-Type': 'application/graphql' }

var _request
export class TestServer {

	static async start() {
		var app = await App.start()
		_request = supertest.agent(app.listener)
		return this
	}

	static async stop() {
		await App.stop()
		_request = null
		return this
	}
}

// export const sendGraph = (graph, callback) => {
// 	return _request.post('/graphql')
// 		.set(HEADERS)
// 		.send(graph)
// 		.end((err, res) => {
// 			if (err || (res.body.errors && res.body.errors[0].message) ) {
// 				var msg = err || res.body.errors[0].message
// 				console.log('sendGraph error: ' + msg)
// 			} else {
// 				callback(res.body.data)
// 			}
// 		})
// }

export const sendMutation = (graph, callback) => {
	return _request.post('/graphql')
		.set(HEADERS)
		.send(`mutation { ${graph.trim()} }`)
		.end((err, res) => {
			if (err || (res.body.errors && res.body.errors[0].message) ) {
				var msg = err || res.body.errors[0].message
				console.log('sendMutation error: ' + msg)
			} else {
				callback(res.body.data)
			}
		})
}

export const sendQuery = (graph, callback) => {
	return _request.post('/graphql')
		.set(HEADERS)
		.send(`query { ${graph.trim()} }`)
		.end((err, res) => {
			if (err || (res.body.errors && res.body.errors[0].message) ) {
				var msg = err || res.body.errors[0].message
				console.log('sendQuery error: ' + msg)
			} else {
				callback(res.body.data)
			}
		})
}
