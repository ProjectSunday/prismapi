import rest from 'rest'

import { Administrator } from './backend'
import { ADMIN, GROUP, request, URL} from './meetup'

export class Member {
	constructor(context) {
		this.context = context
		return this
	}

	async fetch() {

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.context.user.token}` },
			path: URL.MEMBERS + '/self'
		})

		result = JSON.parse(result.entity)
		if (!result) throw "Unable to get meetup member"
		if (result.problem) throw result.problem

		this.context.user.meetupMember = result

		return this
	}

	async fetchRole(id = this.data.id) {
		console.assert(id !== undefined, 'Member.fetchRole() - id is undefined')

		var result = await request({
			method: 'GET',
			path: `${URL.PROFILE}/${GROUP.ID}/${id}?key=${ADMIN.API_KEY}&sign=true`
		})

		this.data.role = result.role

		return this
	}

	async promoteToEventOrganizer(id = this.data.id) {

		var result = await request({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${Administrator.data.access_token}` },
			path: `${URL.MEMBERS}/${id}`,
			params: {
				add_role: 'event_organizer'
			}
		})

		if (result && result.group_profile) {
			this.data.role = result.group_profile.role
		} else {
			console.log('Member.promoteToEventOrganizer() error')
			console.log(result)
		}
	}

}