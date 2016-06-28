import { ObjectID } from 'mongodb'

import { Create, Read, ReadMany } 	from './db'
import { User, secure }				from './backend'
import { Event } 					from './meetup'

export class UpcomingClass {
	constructor(context) {
		this.context = context
	}

	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async create(event = this.data.event) {
		var user = await new User(this.context).fetch()
		await user.ensureOrganizer()
		this.data.teacher = user.data._id

		var event = new Event(this.context)
		await event.post(event)
		this.data.event = event.data

		await this.save()

		return this
	}

	async delete(_id = this.data._id) {
		console.assert(_id !== undefined, 'UpcomingClass.delete: _id undefined')
		// console.assert(token !== undefined, 'UpcomingClass.delete: token undefined')

		//make sure user is allow to delete

		var user = await new User(this.context).fetch()

		await this.fetch(_id)

		if (!this.data.teacher.equals(user.data._id)) throw "User did not create this class."

		// log(this.data, 'upcomingclasses')

		var event = await new Event(this.context).delete(this.data.event.id)

		if (event.data.status !== 'DELETE_SUCCESS') throw 'Event not deleted.'
		log(event, 'event')
		//remove event



		this.data = {
			_id,
			status: 'DELETE_SUCCESS'
		}
		//if sucess, remove db
		return this

	}

	async getAll() {
		this.data = await ReadMany('upcomingclasses')
	}

	async save() {
		await Create('upcomingclasses', this.data)
	}

	async fetch(_id = this.data._id) {
		this.data = await Read('upcomingclasses', { _id: ObjectID(_id) })
		return this
	}
}

