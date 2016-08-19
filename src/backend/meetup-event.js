import rest from 'rest'

import { meetupRest, URL } from './meetup'

export class Event {
	constructor(context) {
		this.context = context
	}

	async post() {
		var context = this.context

		var result = await meetupRest({
			method: 'POST',
			headers: { 'Authorization': `Bearer ${context.user.token}` },
			path: URL.EVENTS,
			params: context.upcomingClass.event
		})

		if (result.errors) throw result.errors[0].message

		context.upcomingClass.event = result

		return this
	}

	static async post2(args) {
		var result = await meetupRest({
			method: 'POST',
			headers: { 'Authorization': `Bearer ${args.token}` },
			path: URL.EVENTS,
			params: args.newEvent
		})

		if (result.errors) throw result.errors[0].message

		return result
	}

	async delete() {
		var context = this.context

		var result = await meetupRest({
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${context.user.token}` },
			path: URL.EVENTS + `/${context.upcomingClass.event.id}`
		})

		if (result.errors && result.errors[0].message === 'event was deleted') {
			context.upcomingClass.event.status = 'DELETE_SUCCESS'
			return this
		}

		if (result.status.code === 204 ) {
			context.upcomingClass.event.status = 'DELETE_SUCCESS'
			return this
		}

		console.log(result)
		throw 'Error deleting meetup event'
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