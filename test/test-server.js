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

export const sendGraph = (graph) => {
	return new Promise((resolve, reject) => {

		_request.post('/graphql')
			.set(HEADERS)
			.send(graph)
			.end((err, res) => {
				if (err || (res.body.errors && res.body.errors[0].message) ) {
					var msg = err || res.body.errors[0].message
					console.log('sendGraph error: ' + msg)
					reject(msg)
				} else {
					var keys = Object.keys(res.body.data)
					resolve(res.body.data[keys[0]])
				}
			})
	})
}

export const sendMutation = (graph) => {
	// return await sendGraph(`mutation { ${graph.trim()} }`)

	return new Promise((resolve, reject) => {

		_request.post('/graphql')
			.set(HEADERS)
			.send(`mutation { ${graph.trim()} }`)
			.end((err, res) => {
				if (err || (res.body.errors && res.body.errors[0].message) ) {
					var msg = err || res.body.errors[0].message
					console.log('sendGraph error: ' + msg)
					reject(msg)
				} else {
					var keys = Object.keys(res.body.data)
					resolve(res.body.data[keys[0]])
				}
			})
	})

}

export const sendQuery = async (graph) => {
	return await sendGraph(`query { ${graph.trim()} }`)
}
