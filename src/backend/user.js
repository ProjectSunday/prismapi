import { ObjectID } from 'mongodb'

import DB from './db'
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

	get() {
		var user = Object.assign({}, this)
		delete user.context
		delete user.token
		delete user.meetup.token
		return user
	}

	async authenticateViaMeetup(token) {
		var member = new Member()
		await member.fetch({ token })
		if (member.error) {
			return { error: member.error }
		}

		var user = await DB.Read('users', { 'meetup.member.id': member.id })
		if (!user) {
			this.error = { message: 'User not found with this token: ' + token }
		}
		Object.assign(this, user)
	}

	async create(newUser) {
		var user = await DB.Create('users', newUser)
		Object.assign(this, user)
	}
	async createFromMeetup(credential) {
		this.token = generateToken()

		this.meetup = {}
		this.meetup.token = await MeetupOauth.getToken(credential)

		var member = new Member()
		await member.fetch({ token: this.meetup.token})
		this.meetup.member = member

		var filter = { 'meetup.member.id': this.meetup.member.id }

		var user = Object.assign({}, this)
		delete user.context

		user = await DB.Update("users", filter, user)
		Object.assign(this, user)
		return this
	}

	async delete(filter) {
		return await DB.Delete('users', filter)
	}

	async fetch(filter) {
		var user = await DB.Read('users', filter)
		if (!user) { throw 'User not found with filter: ' + JSON.stringify(filter) }
		Object.assign(this, user)
	}
	
	async read(filter) {
		var user = await DB.Read('users', filter)
		if (!user) { throw 'User not found with filter: ' + JSON.stringify(filter) }
		Object.assign(this, user)
	}

	async update(filter) {
		var user = Object.assign({}, this)
		delete user.context
		await DB.Update('users', filter, user)
		Object.assign(this, user)
	}

	static async fetch2(filter) {
		var user = await DB.Read('users', filter)
		if (!user) { throw 'User not found.' }
			
		// delete user.token
		// delete user.meetup.token

		return user
	}

	async upsert(filter, updatedUser) {
		var user
		try {
			user = await this.read(filter)
		} catch (err) {
			user = await this.create(updatedUser)
		} finally {
			Object.assign(this, user)
		}
	}

	async save() {
		var user = Object.assign({}, this)
		delete user.context
		await DB.Update('users', { _id: this._id }, user)
	}

	// async authenticate(credential) {
	// 	this.token = await MeetupOauth.getToken(credential)

	// 	this.meetupMember = await Member.fetch(this.token)

	// 	var filter = { 'meetupMember.id': this.meetupMember.id }
	// 	var user = await DB.Update("users", filter, this.get())
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

	async logout(filter) {
		await this.read(filter)

		this.token = null
		await this.update({ _id: this._id })

		this.status = 'LOGOUT_SUCCESS'
	}

}
