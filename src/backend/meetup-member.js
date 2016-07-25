import rest from 'rest'

import { Administrator } from './backend'
import { ADMIN, GROUP, request, URL} from './meetup'

export class Member {
	constructor(context) {
	// 	this.context = context
		return this
	}

	static async fetch(token) {

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` },
			path: URL.MEMBERS + '/self'
		})

		result = JSON.parse(result.entity)
		if (!result) throw "Unable to get meetup member"
		if (result.problem) throw result.problem

		return result
	}

	async fetchRole() {
		var context = this.context

		var result = await request({
			method: 'GET',
			path: `${URL.PROFILE}/${GROUP.ID}/${context.user.meetupMember.id}?key=${ADMIN.API_KEY}&sign=true`
		})

		this.context.user.meetupMember.role = result.role
	}

	async promoteToEventOrganizer() {
		var context = this.context

		var result = await request({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${Administrator.data.access_token}` },
			path: `${URL.MEMBERS}/${context.user.meetupMember.id}`,
			params: {
				add_role: 'event_organizer'
			}
		})

		if (result && result.group_profile) {
			this.context.user.meetupMember.role = result.group_profile.role
		} else {
			console.log('Member.promoteToEventOrganizer() error')
			console.log(result)
		}
	}

}