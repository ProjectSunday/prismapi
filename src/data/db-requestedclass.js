import { ObjectID } from 'mongodb'
import { Delete, Query, QueryAll, ReadMany, Mutate } from './db-common'

export default class RequestedClass {
	constructor() {
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async getAll() {
		var all = await ReadMany('requestedclasses')
		this.data = all
	}
	create (requested) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.insertOne(requested).then(r => {
				return collection.find({ _id: r.insertedId }).toArray()
			}).then(docs => {
				resolve(docs[0])
			}, reject)
		})
	}

	async delete(_id) {
		var r = await Delete({ _id: ObjectID(_id) })
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