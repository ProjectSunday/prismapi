import rest from 'rest'

import { Administrator } from './backend'
import { ADMIN, GROUP, request, URL} from './meetup'

export class Member {
	constructor() {
	// 	this.context = context
		// return this
	}

	get() {
		var member = Object.assign({}, this)
		delete member.context
		return member
	}

	async fetch(args) {
		var member = await request({
			method: 'GET',
			headers: {
				Authorization: `Bearer ${args.token}`,
				'X-Meta-Photo-Host': 'secure'
			},
			path: URL.MEMBERS + '/self'
		})
		if (member.errors) {
			console.log('Meetup Member errors:', member.errors, 'args:', args)
			throw member.errors[0]
		}
		if (member.problem) throw member.problem
		if (!member || !member.id) throw "Unable to get meetup member"

		Object.assign(this, member)
	}

	async fetchRole(args) {
		var result = await request({
			method: 'GET',
			path: `${URL.PROFILE}/${GROUP.ID}/${args.id}?key=${ADMIN.API_KEY}&sign=true`
		})
		this.role = result.role
	}

	async promoteToEventOrganizer() {
		// var context = this.context
		var administrator = new Administrator()

		var result = await request({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${administrator.access_token}` },
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