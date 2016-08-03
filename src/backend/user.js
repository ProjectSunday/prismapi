import { ObjectID } from 'mongodb'

import Db from './db'
import { Member, OAUTH, MeetupOauth }		from './meetup'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		return this
	}

	get() {
		var user = {
			token: this.token,
			meetupMember: this.meetupMember
		}
		if (this._id) user._id = this._id
		return user
	}

	async create(newUser) {
		return await Db.Create('users', newUser)
	}

	async delete(_id) {
		return await Db.Delete('users', { _id: ObjectID(_id)})
	}

	async fetch(token) {
		var user = await Read('users', { token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe? udpate profile, not get
		Object.assign(this, user)
	}

	async upsert(filter) {
		if (!filter) {

		}
	}

	async save() {
		var context = this.context
		await Db.Update('users', { _id: ObjectID(context.user._id ) }, context.user)
	}

	async authenticate() {
		this.token = await MeetupOauth.getToken({
			email: this.meetupEmail,
			password: this.meetupPassword
		})

		this.meetupMember = await Member.fetch(this.token)

		var filter = { 'meetupMember.id': this.meetupMember.id }
		var user = await Db.Update("users", filter, this.get())
		Object.assign(this, user)
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

