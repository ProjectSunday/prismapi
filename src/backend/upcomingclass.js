import { ObjectID } from 'mongodb'

import { Create, Read, ReadMany } 	from './db'
import { User }						from './backend'
import { Event } 					from './meetup'

export class UpcomingClass {
	constructor(_id) {
		this.data._id = _id
	}
	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async create() {
		var user = new User(this.token)
		await user.fetch()
		await user.ensureOrganizer()
		this.data.teacher = user.data._id

		var event = new Event(this.token)
		event.data = this.data.event
		await event.post()
		this.data.event = event.data

		await this.save()
	}

	async delete(token, _id) {

		//make sure user is allow to delete

		var user = await new User(token).fetch()


		this.fetch(_id)

		// var blah = await user.fetch()

		// log(user, 'user')

		// var upcoming = await new UpcomingClass(this._id).fetch()

		// log(upcoming, 'upcoming')

		// if (user.data._id ==  )

		//remove event

		//if sucess, remove db


	}

	async getAll() {
		this.data = await ReadMany('upcomingclasses')
	}

	async save() {
		await Create('upcomingclasses', this.data)
	}

	async fetch() {
		this.data = await Read('upcomingclasses', { _id: ObjectID(this.data._id) })
		return this
	}
}


