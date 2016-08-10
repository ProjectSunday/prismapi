import { ObjectID } from 'mongodb'

import Db from './db'
import { Member, OAUTH, MeetupOauth }		from './meetup'
import { generateToken } from './utils'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		return this
	}

	// toJSON() {
	// 	var meetup = Object.assign({}, this.meetup)
	// 	delete meetup.token

	// 	var user = {
	// 		meetup
	// 	}
	// 	if (this._id) 			user._id 	= this._id
	// 	if (this.error) 		user.error 	= this.error
	// 	return user
	// }

	async authenticateViaMeetup(token) {
		var member = new Member()
		await member.fetch({ token })
		if (member.error) {
			return { error: member.error }
		}

		var user = await Db.Read('users', { 'meetup.member.id': member.id })
		if (!user) {
			this.error = { message: 'User not found with this token: ' + token }
		}
		Object.assign(this, user)
	}

	async create(newUser) {
		return await Db.Create('users', newUser)
	}
	async createFromMeetup(credential) {
		this.token = generateToken()

		this.meetup = {}
		this.meetup.token = await MeetupOauth.getToken(credential)

		this.meetup.member = new Member()
		this.meetup.member.fetch({ token: this.meetup.token})

		var filter = { 'meetup.member.id': this.meetup.member.id }

		var user = Object.assign({}, this)
		delete user.context

		user = await Db.Update("users", filter, user)
		Object.assign(this, user)
		return this
	}

	async delete(filter) {
		return await Db.Delete('users', filter)
	}

	async fetch(filter) {
		var user = await Db.Read('users', filter)
		if (!user) { throw 'User not found with filter: ' + JSON.stringify(filter) }
		Object.assign(this, user)
	}

	static async fetch2(filter) {
		var user = await Db.Read('users', filter)
		if (!user) { throw 'User not found.' }
			
		// delete user.token
		// delete user.meetup.token

		return user
	}

	async upsert(filter) {
		if (!filter) {

		}
	}

	async save() {
		var user = Object.assign({}, this)
		delete user.context
		await Db.Update('users', { _id: this._id }, user)
	}

	// async authenticate(credential) {
	// 	this.token = await MeetupOauth.getToken(credential)

	// 	this.meetupMember = await Member.fetch(this.token)

	// 	var filter = { 'meetupMember.id': this.meetupMember.id }
	// 	var user = await Db.Update("users", filter, this.get())
	// 	Object.assign(this, user)
	// }

	async ensureOrganizer() {
		// var context = this.context

		var member = new Member()
		await member.fetch({ token: this.context.user.meetup.token })
		await member.fetchRole()

		var role = member.role
	    if (role !== 'Event Organizer' || role !== 'Organizer') {
	    	// await member.promoteToEventOrganizer()
	    	await this.save()
	    }

	}

}
