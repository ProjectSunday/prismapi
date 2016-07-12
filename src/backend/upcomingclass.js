import { ObjectID } from 'mongodb'

import DB			from './db'
import { User }		from './backend'
import { Event } 	from './meetup'

export class UpcomingClass {
	constructor(context) {
		this.context = context
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async create() {
		console.assert(this.data.event !== undefined, 'UpcomingClass.create() - this.data.event undefined')

		var user = await new User(this.context).fetch()
		await user.ensureOrganizer()
		this.data.teacher = user.data._id

		var event = new Event(this.context)
		await event.post(this.data.event)
		this.data.event = event.data

		this.data = await DB.Create('upcomingclasses', this.data)

		return this
	}

	async delete() {
		console.assert(_id !== undefined, 'UpcomingClass.delete: _id undefined')
		// console.assert(token !== undefined, 'UpcomingClass.delete: token undefined')

		await this.fetch(_id)

		var user = await new User(this.context).fetch()
		if (!this.data.teacher.equals(user.data._id)) throw "User did not create this class."

		var event = await new Event(this.context).delete(this.data.event.id)
		if (event.data.status !== 'DELETE_SUCCESS') throw 'Event not deleted.'

		var r = await DB.Delete('upcomingclasses', { _id: ObjectID(_id) })
		if (r.status !== 'DELETE_SUCCESS') throw 'UpcomingClass was not deleted from DB.'
		this.data = { _id, status: r.status }

		return this
	}

	async getAll() {
		this.data = await DB.ReadMany('upcomingclasses')
	}

	async fetch(_id = this.data._id) {
		this.data = await DB.Read('upcomingclasses', { _id: ObjectID(_id) })
		return this
	}
}

