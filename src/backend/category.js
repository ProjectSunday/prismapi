import { ObjectID } from 'mongodb'

import Db from './db'

export class Category {
	constructor(context) {
		this.context = context
		return this
	}

	async create(category) {
		return await Db.Create('categories', category)
	}

	async delete (_id) {
		return await Db.Delete('categories', { _id: ObjectID(_id) })
	}

	async fetch(_id) {
		return await Db.Read('categories', { _id: ObjectID(_id) })
	}

	static async fetchAll() {
		return await Db.ReadMany('categories')
	}
}

