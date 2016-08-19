
// import { Testing } from './testing'

// import { randomBytes } from 'crypto'

// Testing.data = { yo: 'yo' }

// console.log(Testing.data)
// setTimeout(() => {
// 	console.log(Testing.data)
// }, 5000)

// Testing.data = { blah: 'blah' }

export * from './administrator'
export * from './category'
export * from './context'
export * from './requestedclass'
// export * from './upcomingclass'
// export * from './user'


import { ObjectID } from 'mongodb'

import DB from './db'
import { Administrator2, Member, Member2, OAUTH, MeetupOauth }		from './meetup'
import { Event, deleteEvent } 										from './meetup'
import { generateToken } from './utils'

import request from 'request'


////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingClass
////////////////////////////////////////////////////////////////////////////////////////////////////


export class UpcomingClass {
	constructor(context) {
		this.context = context
	}

	async create(newClass) {
		// var context = this.context

		// var user = new User(context)
		// await user.fetch()
		// await user.ensureOrganizer()
		
		// context.upcomingClass.teacher = context.user._id

		var event = new Event(context)
		await event.post()

		var upcoming = await DB.Create('upcomingclasses', context.upcomingClass)
		Object.assign(context.upcomingClass, upcoming)

		return this
	}

	async create2(newClass) {

		var category = Object.assign({}, this.context.category)
		delete category.context


		var newEvent = {
			name: newClass.name
		}

		var event = await Event.post2({
			token: this.context.user.meetup.token,
			newEvent
		})

		var teacher = Object.assign({}, this.context.user)
		delete teacher.context
		delete teacher.token
		delete teacher.meetup.token

		var upcomingClass = {
			category,
			event,
			teachers: [ teacher ]
		}

		upcomingClass = await DB.Create('upcomingclasses', upcomingClass)

		Object.assign(this, upcomingClass)
	}

	async read(filter) {
		var upcoming = await DB.Read('upcomingclasses', filter)
		if (!upcoming) throw 'Unable to get upcoming class with filter: ' + JSON.stringify(filter)
		Object.assign(this, upcoming)
	}

	async delete(filter) {
		await this.read(filter)

		if (!this._userIsTeacher(this.context.user._id)) throw "User did not create this class."

		await deleteEvent({ token: this.context.user.meetup.token, id: this.event.id })
		
		var result = await DB.Delete('upcomingclasses', { _id: this._id })

		Object.assign(this, result)
	}

	_userIsTeacher(_id) {
		// var _id = ObjectID(_id)
		for (var i = 0; i < this.teachers.length; i++) {
			// console.log('yo', this.teachers[i]._id, _id)
			if (this.teachers[i]._id.equals(_id)) return true
		}
		return false
	}

	async getAll() {
		this.context.upcomingClasses = await DB.ReadMany('upcomingclasses')
	}

	async fetch() {
		var upcoming = await DB.Read('upcomingclasses', { _id: ObjectID(this.context.upcomingClass._id) })
		Object.assign(this.context.upcomingClass, upcoming)
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//User
////////////////////////////////////////////////////////////////////////////////////////////////////


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
		if (!user) { throw 'User.fetch() - User not found with filter: ' + JSON.stringify(filter) }
		Object.assign(this, user)
	}
	
	async read(filter) {
		var user = await DB.Read('users', filter)
		if (!user) { throw 'User.read() - User not found with filter: ' + JSON.stringify(filter) }
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





