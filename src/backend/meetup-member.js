import rest from 'rest'

import { PRISMAPIKEY, PRISMGROUPID, URL } from './meetup'
import { Administrator } from './meetup'

export class Member {
	constructor(token) {
		if (!token) throw "An access token is required to create a meetup member"
		this.token = token
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async fetch() {

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.token}` },
			path: URL.MEMBER_SELF
		})

		result = JSON.parse(result.entity)
		if (!result) throw "Unable to get meetup member"
		if (result.problem) throw result.problem

		this.data = result
	}

	async fetchRole() {
		//data.id must exist

		var result = await rest({
			method: 'GET',
			path: `${URL.PROFILE}/${PRISMGROUPID}/${this.data.id}?key=${PRISMAPIKEY}&sign=true`
		})

		result = JSON.parse(result.entity)

		if (result.role) {
			this.data.role = result.role
		} else {
			console.log('Unable to fetchRole()')
			console.log(result)
		}
	}

	async promoteToEventOrganizer() {
		var administrator = new Administrator()

		var result = await rest({
			method: 'POST',
			headers: { Authorization: `Bearer ${administrator.data.access_token}` },
			path: `${URL.PROFILE}/${PRISMGROUPID}/${this.data.id}?add_role=event_organizer`
		})

		result = JSON.parse(result.entity)

		if (result.role) {
			this.data.role = result.role
		} else {
			console.log('Member.promoteToEventOrganizer() error')
			console.log(result)
		}
	}

}