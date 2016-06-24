import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member }		from './meetup'

export class User {
	constructor(token) {
		if (!token) { throw 'Not authorized.' }
		this.token = token
	}

	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async fetch() {
		t(2)
		var user = await Read('users', { token: this.token })
		t(3)
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe?
		this.data = user

	}
	async save() {
		await Update('users', { _id: ObjectID(this.data._id ) }, this.data)
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

		var member = new Member(this.token)
		member.data = this.data.meetupMember
		await member.fetchRole()

	    if (true || member.data.role !== 'Event Organizer' || member.data.role !== 'Organizer') {
	    	await member.promoteToEventOrganizer()
	    	this.data.meetupMember = member.data
	    	await this.save()
	    }

	}
}