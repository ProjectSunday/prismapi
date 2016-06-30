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
	return _request.post('/graphql').set(HEADERS).send(graph)
}
