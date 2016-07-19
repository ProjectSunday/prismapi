import { ObjectID } from 'mongodb'

import Db from './db'
import { Category } from '~/backend/backend'

export class RequestedClass {
	constructor(context) {
		this.context = context
	}

	async fetchAll() {
		this.context.requestedClasses = await Db.ReadMany('requestedclasses')
	}
	async create () {
		this.context.category._id = this.context.requestedClass.category
		var category = new Category(this.context)
		await category.fetch()

		if (!this.context.category) throw 'Unable to determine category with _id: ' + this.context.requestedClass.category

		this.context.requestedClass = await Db.Create('requestedclasses', this.context.requestedClass)
	}

	async delete(_id) {
		this.context.requestedClass = await Db.Delete('requestedclasses', { _id: ObjectID(this.context.requestedClass._id) })
	}

}