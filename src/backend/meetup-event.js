import rest from 'rest'

import { URL } from './meetup'

export class Event {

	constructor(token) {
		if (!token) throw "An access token is required to create an Event"
		this.token = token
	}

	get data() { return this._data || {} }
	set data(d) { this._data = d }

	//data must be set before posting
	async post() {

		var result = await rest({
			method: 'POST',
			headers: { 'Authorization': `Bearer ${this.token}` },
			path: URL.LOCALLEARNERS_EVENTS,
			params: this.data
		})

		result = JSON.parse(result.entity)

		if (result.errors) {
			throw result.errors[0].message
		} else {
			this.data = result
		}

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