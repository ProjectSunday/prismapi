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
		await new MeetupOauth(this.context).login()
		await new Member(this.context).fetch()

		var filter = { 'meetupMember.id': this.context.user.meetupMember.id }
		this.context.user = await Update("users", filter, this.context.user)
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

