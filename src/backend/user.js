import { ObjectID } from 'mongodb'

import DB from './db'
import { Administrator2, Member, Member2, OAUTH, MeetupOauth }		from './meetup'
import { generateToken } from './utils'

import request from 'request'


export class User {
	constructor(context) {
		this.context = context
		return this
	}

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
		if (user) {
			user.token = generateToken()
			user.meetup.token = token
			user.meetup.member = member.get()
			user = await DB.Update('users', { _id: user._id }, user)
		} else {
			user = {
				token: generateToken(),
				meetup: {
					token,
					member: member.get()
				}
			}
			user = await DB.Create('users', user)
		}

		Object.assign(this, user)
	}

	async create(newUser) {
		var user = await DB.Create('users', newUser)
		Object.assign(this, user)
	}
	async _createFromMeetup(credential) {
		var token = await MeetupOauth.getToken(credential)
		var member = new Member()
		await member.fetch({ token })

		var user = await DB.Read('users', { 'meetup.member.id': member.id })

		if (user) {
			user.token = generateToken()
			user.meetup = {
				token,
				member: member.get()
			}
			user = await DB.Update('users', { _id: user._id }, user)
		} else {
			var newUser = {
				token: generateToken(),
				meetup: {
					token,
					member: member.get()
				}
			}
			user = await DB.Create('users', newUser)
		}

		Object.assign(this, user)
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
		var member = await Member2.get({ token: this.meetup.token })

		var role = await Member2.getRole({ id: member.id })
		if (role === 'Event Organizer' || role == 'Organizer') return

		await Administrator2.promoteUser({ id: member.id })
	}

	async logout(filter) {
		await this.read(filter)

		this.token = null
		await this.update({ _id: this._id })

		this.status = 'LOGOUT_SUCCESS'
	}

}
