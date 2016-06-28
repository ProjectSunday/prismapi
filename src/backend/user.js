import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member }		from './meetup'

export class User {
	constructor(context) {
		this.context = context
	}
	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async fetch() {
		var user = await Read('users', { token: this.context.token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe?
		this.data = user

		return this
	}

	async save() {
		await Update('users', { _id: ObjectID(this.data._id ) }, this.data)
	}

	async authenticate() {

		var member = new Member(this.context)
		await member.fetch()

		var filter = { 'meetupMember.id': member.data.id }
		var value = {
			token: this.context.token,
			meetupMember: member.data
		}
		var user = await Update("users", filter, value)

		this.data = user

		return this
	}

	async ensureOrganizer() {

		var member = new Member(this.context)
		member.data = this.data.meetupMember
		await member.fetchRole()

	    if (member.data.role !== 'Event Organizer' || member.data.role !== 'Organizer') {
	    	await member.promoteToEventOrganizer()
	    	this.data.meetupMember = member.data
	    	await this.save()
	    }

	}
}