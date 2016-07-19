import { ObjectID } from 'mongodb'

import Db from './db'
import { Category } from '~/backend/backend'

export class RequestedClass {
	constructor(context) {
		this.context = context
	}

	async create () {
		this.context.category._id = this.context.requestedClass.category
		var category = new Category(this.context)
		await category.fetch()

		if (!this.context.category) throw 'Unable to determine category with _id: ' + this.context.requestedClass.category

		this.context.requestedClass = await Db.Create('requestedclasses', this.context.requestedClass)
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


	async addUserToInterested() {
		await this.read()


		// log(this.context.user, 'requestedclasses')
		var u = this.context.user._id
		// log(u, 'u')
		this.context.requestedClass.interested.push(u)


		await this.update()

		// log(this.context.requestedClass, 'yo')
		
	}

}