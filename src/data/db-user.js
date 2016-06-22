import { db, Query, Read, Update} from '~/data/db-common'

import { Member } from '~/meetup/meetup'

export default class User {
	constructor(token) {
		if (!token) { throw 'Not authorized.' }
		this.token = token
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async fetch() {

		var user = await Read('users', { token: this.token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe?
		this.data = user

	}
	async authenticate() {

		var member = new Member(this.token)
		await member.fetch()

		var filter = { 'meetupMember.id': member.data.id }
		var value = {
			token: this.token,
			meetupMember: member.data
		}
		var user = await Update("users", filter, value)

		this.data = user

	}
	async ensureOrganizer() {

		var role = await getRole(user.token)
	    if (role !== 'Event Organizer' || role !== 'Organizer') {
			var meetupProfile = await promoteMember(user)


			// { meetupProfile: }
			// await db.user.mutate(
			// 	{ _id: user._id },
			// 	{ meetupProfile: meetupProfile }
			// )
	    }

	}
}