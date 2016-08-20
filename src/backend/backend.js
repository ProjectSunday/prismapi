export * from './category'
export * from './context'
export * from './requestedclass'


import { ObjectID } from 'mongodb'

import DB from './db'
import { Event, Member, MeetupOauth, OAuth } from './meetup'
import { generateToken } from './utils'



const MEETUP_ADMIN_EMAIL = process.env.MEETUP_ADMIN_EMAIL ||
	'prismcharlie2016@gmail.com'
const MEETUP_ADMIN_PASSWORD = process.env.MEETUP_ADMIN_PASSWORD ||
	'thirstyscholar1'


////////////////////////////////////////////////////////////////////////////////////////////////////
//Administrator
////////////////////////////////////////////////////////////////////////////////////////////////////
class AdministratorSingleton {
	async getToken() {
		if (this._refreshingToken) {
			await this._refreshingDone()
		}
		
		if (!await this._tokenValid()) {
			await this._refreshToken()
		}

		log(this, 'administrator')
		return this.access_token
	}

	async _refreshingDone() {
		var self = this
		return new Promise((resolve, reject) => {
			global.__prism_admin_timer_id = setInterval(() => {
				console.log('Administrator - waiting for token refresh...')
				if (!self._refreshingToken) {
					clearTimeout(global.__prism_admin_timer_id)
					console.log('REFRESH DONE!')
					resolve()
				}
			}, 1000)
		})
	}

	async _tokenValid () {
		if (!this.access_token || !this.refresh_token) { return false }

		var now = new Date()
		var age = now - this.created

		console.log('age: ', age, ' > expires_in - 5:', this.expires_in - 300000)

		if (age > this.expires_in - 300000) {
			console.log('OLD!!!!!!!!!!')
			return false
		}

		return true
	}

	async _refreshToken () {
		this._refreshingToken = true

		var auth = await OAuth.authorize({
			email: MEETUP_ADMIN_EMAIL,
			password: MEETUP_ADMIN_PASSWORD,
			// scope: 'basic+event_management+profile_edit'
			scope: 'ageless+basic+event_management+profile_edit'
		})

		Object.assign(this, auth)

		this._refreshingToken = false
	}
}
export const Administrator = new AdministratorSingleton()
////////////////////////////////////////////////////////////////////////////////////////////////////
//Testing
////////////////////////////////////////////////////////////////////////////////////////////////////
export class Testing {
	constructor() {

	}

	async test() {

		for (var i = 0; i < 6; i++) {
			await Administrator.getToken()
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingClass
////////////////////////////////////////////////////////////////////////////////////////////////////
export class UpcomingClass {
	constructor(context) {
		this.context = context
	}
	async create(newClass) {
		var category = Object.assign({}, this.context.category)
		delete category.context

		var newEvent = {
			name: newClass.name
		}

		var event = await Event.post({
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

		await Event.delete({ token: this.context.user.meetup.token, id: this.event.id })
		
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

	async create(newUser) {
		var user = await DB.Create('users', newUser)
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
	async delete(filter) {
		return await DB.Delete('users', filter)
	}


	async authenticateViaMeetup(token) {
		var member = await Member.get({ token })
		if (member.error) {
			return { error: member.error }
		}

		var user = await DB.Read('users', { 'meetup.member.id': member.id })
		if (user) {
			user.token = generateToken()
			user.meetup.token = token
			user.meetup.member = member
			user = await DB.Update('users', { _id: user._id }, user)
		} else {
			user = {
				token: generateToken(),
				meetup: {
					token,
					member
				}
			}
			user = await DB.Create('users', user)
		}
		Object.assign(this, user)
	}

	
	async _createFromMeetup(credential) {
		var { access_token: token } = await OAuth.authorize(credential)
		var member = await Member.get({ token })

		var user = await DB.Read('users', { 'meetup.member.id': member.id })

		if (user) {
			user.token = generateToken()
			user.meetup = {
				token,
				member
			}
			user = await DB.Update('users', { _id: user._id }, user)
		} else {
			var newUser = {
				token: generateToken(),
				meetup: {
					token,
					member
				}
			}
			user = await DB.Create('users', newUser)
		}

		Object.assign(this, user)
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

	async ensureOrganizer() {
		var member = await Member.get({ token: this.meetup.token })



		var role = await Member.getRole({ id: member.id })
		if (role === 'Event Organizer' || role == 'Organizer') return

		var adminToken = await Administrator.getToken()

		t(1)
		member = await Member.addRole({
			adminToken,
			id: member.id,
			role: 'event_organizer'
		})

		t(2)


		// if (result && result.group_profile) {
		// 	return result
		// } else {
		// 	console.log('Administrator2.promoteUser() error')
		// 	console.log(result)
		// }


	}

	async logout(filter) {
		await this.read(filter)

		this.token = null
		await this.update({ _id: this._id })

		this.status = 'LOGOUT_SUCCESS'
	}

}





