import { db, Query, Mutate } from '~/data/db-common'
import { Member } from '~/meetup/meetup'

export default class User {
	constructor(token) {
		if (!token) { throw 'Not authorized.' }
		this._token = token
		this._data = {}
	}
	save() {
		log(this, 'this')
	}
	async get() {
		var users = await _db.collection('users').find({ 'meetupMember.token': this._token }).toArray()
		if (!users.length) { throw 'User not found.' }

		//also get meetup profile here, maybe?

		Object.assign(this._data, users[0])
		return this._data
	}
	async fetch(token) {
		if (!token) { throw 'Not authorized.' }

		var users = await _db.collection('users').find({ 'meetupMember.token': token }).toArray()
		if (!users.length) { throw 'User not found.' }

		//also get meetup profile here, maybe?

		Object.assign(this, users[0])
	}
	async authenticate() {

		var member = new Member(this._token)
		await member.fetch()

		var collection = _db.collection("users")
		var filter = { 'meetupMember.id': member.id }
		var value = { meetupMember: member }
		var user = await MUTATE(collection, filter, value)

		Object.assign(this, user)

	}
	async ensureOrganizer() {

		var role = await getRole(user.token)
	    if (role !== 'Event Organizer' || role !== 'Organizer') {
			var meetupProfile = await promoteMember(user)


			// { meetupProfile: }
			// await db.user.mutate(
			// 	{ _id: user._id },
			// 	{ meetupProfile: meetupProfile }
			// )
	    }

	}
}