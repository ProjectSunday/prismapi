import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member, OAUTH, MeetupOauth }		from './meetup'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		return this
	}

	get() {
		return {
			_id: this._id,
			token: this.token,
			meetupMember: this.meetupMember
		}
	}

	async fetch() {
		var user = await Read('users', { token: this.token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe? udpate profile, not get
		Object.assign(this, user)
		return this
	}

	async save() {
		var context = this.context
		await Update('users', { _id: ObjectID(context.user._id ) }, context.user)
	}

	async authenticate() {
		this.token = await MeetupOauth.getToken({
			email: this.meetupEmail,
			password: this.meetupPassword
		})

		this.meetupMember = await Member.fetch(this.token)

		var filter = { 'meetupMember.id': this.meetupMember.id }
		var user = await Update("users", filter, this.get())
		Object.assign(this, user)

		log(this, 'authenticate')
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

