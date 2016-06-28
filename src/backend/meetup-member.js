import rest from 'rest'

import { PRISMAPIKEY, PRISMGROUPID, URL } from './meetup'
import { Administrator, request } from './meetup'

export class Member {
	constructor(context) {
		this.context = context
	}

	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async fetch() {

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.context.token}` },
			path: URL.MEMBERS + '/self'
		})

		result = JSON.parse(result.entity)
		if (!result) throw "Unable to get meetup member"
		if (result.problem) throw result.problem

		this.data = result

		return this
	}

	async fetchRole(id = this.data.id) {
		console.assert(id !== undefined, 'Member.fetchRole() - id is undefined')

		var result = await request({
			method: 'GET',
			path: `${URL.PROFILE}/${PRISMGROUPID}/${id}?key=${PRISMAPIKEY}&sign=true`
		})

		this.data.role = result.role

		return this
	}

	async promoteToEventOrganizer(id = this.data.id) {
		var administrator = new Administrator()


		log(administrator.data.access_token, 'admin')
		// log(URL.PROFILE)

		log(id, 'id')
		log(this.data, 'data')
		var result = await request({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${administrator.data.access_token}` },
			path: `${URL.MEMBERS}/${id}`,
			params: {
				add_role: 'event_organizer'
			}
		})

		log(result, 'result')

		if (result.role) {
			this.data.role = result.role
		} else {
			console.log('Member.promoteToEventOrganizer() error')
			console.log(result)
		}
	}

}