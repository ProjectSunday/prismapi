import rest from 'rest'

import { request, URL } from './meetup'

export class Event {
	constructor(context) {
		this.context = context
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async post(event = this.data) {

		var result = await request({
			method: 'POST',
			headers: { 'Authorization': `Bearer ${this.context.token}` },
			path: URL.EVENTS,
			params: event
		})

		if (result.errors) throw result.errors[0].message

		this.data = result
		return this
	}

	async delete(id) {

		var result = await request({
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${this.context.token}` },
			path: URL.EVENTS + `/${id}`
		})

		if (result.errors && result.errors[0].message === 'event was deleted'){
			this.data = {
				status: 'DELETE_SUCCESS'
			}
		}

		if (result.status.code === 204 ) {
			this.data = { status: 'DELETE_SUCCESS' }
		}

		return this
	}


	// async function removeEvent (token, eventId) {
	// 	var result = await rest({
	// 		method: 'DELETE',
	// 		headers: { 'Authorization': `Bearer ${token}` },
	// 		path: URL.DELETEEVENT + `/${eventId}`
	// 	})

	// 	log(result.entity, 'result.entity')
	// }

	// async get() {

	// 	var result = await rest({
	// 		method: 'GET',
	// 		headers: { Authorization: `Bearer ${this.token}` },
	// 		path: MEETUPAPI_MEMBER_SELF
	// 	})

	// 	result = JSON.parse(result.entity)
	// 	if (!result) throw "Unable to get meetup member"
	// 	if (result.problem) throw result.problem

	// 	Object.assign(this, result)
	// }


}