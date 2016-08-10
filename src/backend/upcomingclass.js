import { ObjectID } from 'mongodb'

import DB			from './db'
import { User }		from './backend'
import { Event } 	from './meetup'

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

		console.log('teacher', teacher)

		var upcomingClass = {
			category,
			event,
			teachers: [ teacher ]
		}

		upcomingClass = await DB.Create('upcomingclasses', upcomingClass)

		Object.assign(this, upcomingClass)
	}

	async delete() {
		var context = this.context

		await this.fetch()
		await new User(context).fetch()

		if (!context.userIsTeacher) throw "User did not create this class."

		await new Event(context).delete()

		var r = await DB.Delete('upcomingclasses', { _id: ObjectID(context.upcomingClass._id) })
		if (r.status !== 'DELETE_SUCCESS') throw 'UpcomingClass was not deleted from DB.'
		context.upcomingClass.status = r.status
	}

	async getAll() {
		this.context.upcomingClasses = await DB.ReadMany('upcomingclasses')
	}

	async fetch() {
		var upcoming = await DB.Read('upcomingclasses', { _id: ObjectID(this.context.upcomingClass._id) })
		Object.assign(this.context.upcomingClass, upcoming)
	}
}

