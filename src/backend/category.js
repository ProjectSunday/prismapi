import { ObjectID } from 'mongodb'

import Db from './db'

export class Category {
	constructor(context) {
		this.context = context
		return this
	}

	toJSON () {
		var category = {
			name: this.name,
			imageName: this.imageName
		}
		if (this._id) category._id = this._id
		return category
	}

	get() {
		var category = Object.assign({}, this)
		delete category.context
		return category
	}

	async create(category) {
		return await Db.Create('categories', category)
	}

	async read(filter) {
		var category = await Db.Read('categories', filter)
		if (!category) throw 'Unable to fetch category with filter: ' + JSON.stringify(filter)
		Object.assign(this, category)
	}

	async delete(_id) {
		return await Db.Delete('categories', { _id: ObjectID(_id) })
	}

	async fetch(filter) {
		var category = await Db.Read('categories', filter)
		if (!category) throw 'Unable to fetch category with filter: ' + JSON.stringify(filter)
		Object.assign(this, category)
	}

	static async fetch2(filter) {
		var category = await Db.Read('categories', filter)
		if (!catgory) throw 'Unable to fetch category with filter: ' + JSON.stringify(filter)
		return category
	}

	static async fetchAll() {
		return await Db.ReadMany('categories')
	}
}

