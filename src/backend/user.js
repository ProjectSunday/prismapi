import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member, OAUTH, MeetupOauth }		from './meetup'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		this._data = {}
	}
	get data() { return this._data }
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

	async fetchMeetupProfile() {
		var member = new Member(this.context)
		await member.fetch()
		this.data.meetupMember = member.data
		return this
	}

	async authenticate() {
		await this.fetchAccessToken()
		await this.fetchMeetupProfile()

		var filter = { 'meetupMember.id': this.data.meetupMember.id }
		var user = await Update("users", filter, this.data)

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

	async fetchAccessToken() {
		await new MeetupOauth(this.context).login()
		this.data.token = this.context.token
		return this
	}
}

