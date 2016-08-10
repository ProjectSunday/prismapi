import { ObjectID } from 'mongodb'

import DB			from './db'
import { User }		from './backend'
import { Event, deleteEvent } 	from './meetup'

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

