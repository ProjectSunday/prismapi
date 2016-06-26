import { Create } 	from './db'
import { User }		from './backend'
import { Event } 	from './meetup'

export class UpcomingClass {
	constructor(token) {
		this.token = token
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

		await this.save()
	}

	async save() {
		await Create('upcomingclasses', this.data)
	}
	// async fetch() {
	// 	if (!this.token) { throw 'Not authorized.' }

	// 	var users = await _db.collection('users').find({ 'meetupMember.token': this.token }).toArray()
	// 	if (!users.length) { throw 'User not found.' }

	// 	//also get meetup profile here

	// 	Object.assign(this, users[0])
	// }
}


