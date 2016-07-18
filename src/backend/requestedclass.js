import { ObjectID } from 'mongodb'
import { Create, Delete, Query, QueryAll, ReadMany, Mutate } from './db'

export class RequestedClass {
	constructor(context) {
		this.context = context
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async getAll() {
		this.context.requestedClasses = await ReadMany('requestedclasses')
	}
	async create (requested) {

		//verify category here

		var r = await Create('requestedclasses', requested)
		this.data = r

	}

	async delete(_id) {
		var r = await Delete('requestedclasses', { _id: ObjectID(_id) })
		this.data = {
			_id,
			status: r.status
		}
	}

	read (_id) {
		return new Promise((resolve, reject) => {
			// if (_id === undefined) {
			// 	var query = {}
			// } else {
			// 	var query = { _id: ObjectID(_id) }
			// }
			// console.log('query,', query)
			var collection = _db.collection('requestedclasses')
			collection.find().toArray().then(resolve, reject)
		})
	}


}