import { ObjectID } from 'mongodb'

import Db from './db'
import { Category } from '~/backend/backend'

export class RequestedClass {
	constructor(context) {
		this.context = context
		return this
	}

	async create (newClass) {
		var category = new Category(this.context).fetch(newClass.category._id)

		if (!category) throw 'Unable to determine category with _id: ' + newClass.category._id

		newClass.category = category

		return await Db.Create('requestedclasses', newClass)
	}
	async read() {
		this.context.requestedClass = await Db.Read('requestedclasses', { _id: ObjectID(this.context.requestedClass._id) })
	}
	async update() {
		await Db.Update('requestedclasses', { _id: ObjectID(this.context.requestedClass._id) }, this.context.requestedClass)
	}
	async delete() {
		this.context.requestedClass = await Db.Delete('requestedclasses', { _id: ObjectID(this.context.requestedClass._id) })
	}



	async fetchAll() {
		this.context.requestedClasses = await Db.ReadMany('requestedclasses')
	}

	async addInterestedUser() {
		await this.read()

		var u = this.context.user
		this.context.requestedClass.interested.push({
			_id: u._id,
			meetupMember: u.meetupMember
		})

		await this.update()
	}

	async removeInterestedUser() {
		await this.read()

		var user = this.context.user

		var removeIndex = this.context.requestedClass.interested.findIndex(u => u._id.equals(user._id))
		if (removeIndex === -1) throw 'Unable to find interested user to remove from requested class.'

		this.context.requestedClass.interested.splice(removeIndex, 1)

		await this.update()
	}

}