import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member, OAUTH, MeetupOauth }		from './meetup'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		return this
	}

	async fetch() {
		var user = await Read('users', { token: this.context.user.token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe?
		Object.assign(this.context.user, user)
		return this
	}

	async save() {
		var context = this.context
		await Update('users', { _id: ObjectID(context.user._id ) }, context.user)
	}

	async authenticate() {
		await new MeetupOauth(this.context).login()
		await new Member(this.context).fetch()

		var filter = { 'meetupMember.id': this.context.user.meetupMember.id }
		this.context.user = await Update("users", filter, this.context.user)
	}

	async ensureOrganizer() {
		var context = this.context

		var member = new Member(context)
		await member.fetch()
		await member.fetchRole()

		var role = context.user.meetupMember.role
	    if (role !== 'Event Organizer' || role !== 'Organizer') {
	    	await member.promoteToEventOrganizer()
	    	await this.save()
	    }

	}

}

