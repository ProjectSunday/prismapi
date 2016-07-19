import { ObjectID } from 'mongodb'

import Db from './db'

export class Category {
	constructor(context) {
		this.context = context
	}

	async create() {
		this.context.category = await Db.Create('categories', this.context.category)
	}

	async delete () {
		this.context.category = await Db.Delete('categories', { _id: ObjectID(this.context.category._id) })
	}


	async fetch() {
		this.context.category = await Db.Read('categories', { _id: ObjectID(this.context.category._id) })
	}

	async fetchAll() {
		this.context.categories = await Db.ReadMany('categories')
	}
}

