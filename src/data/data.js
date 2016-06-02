import { MongoClient, ObjectID } from 'mongodb'

import { getMember } from '~/meetup/meetup'


var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'

var _db

export const connect = () => {
	return new Promise((resolve, reject) => {
		MongoClient.connect(PRISM_DB_CONNECTION_STRING).then(db => {
		    console.log('=====> Connected to mongo server:', PRISM_DB_CONNECTION_STRING);
		    _db = db
		    resolve()
		}, error => {
		    console.error('Unable to connect to mongo server.')
		    console.error(error);
		    reject()
		})
	})
}

export const requestedClasses = {
	create (requested) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.insertOne(requested).then(r => {
				return collection.find({ _id: r.insertedId }).toArray()
			}).then(docs => {
				resolve(docs[0])
			}, reject)
		})
	},
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
	},
	delete (_id) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.deleteOne({ _id: ObjectID(_id) }).then(r => {
				// console.log('r:', r)
				if (r.deletedCount === 1) {
					resolve({ _id, status: 'DELETE_SUCCESS' })
				} else {
					resolve({ _id, status: 'DELETE_FAIL' })
				}
			}, reject)
		})
	}
}

export const categories = {
	create (category) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('categories')

			collection.insertOne(category)
			.then(r => {
				return collection.find({ _id: r.insertedId }).toArray()
			})
			.then(docs => {
				resolve(docs[0])
			}, reject)
		})
	},
	read (_id) {

		const readAll = new Promise((resolve, reject) => {
			var collection = _db.collection('categories')
			collection.find().toArray().then(resolve, reject)
		})

		const readOne = new Promise((resolve, reject) => {
			var collection = _db.collection('categories')
			collection.find({ _id: ObjectID(_id) }).toArray().then(result => {
				resolve(result[0])
			}, reject)
		})

		if (_id === undefined) {
			return readAll
		} else {
			return readOne
		}

	},
	delete (_id) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('categories')

			collection.deleteOne({ _id: ObjectID(_id) }).then((r) => {
				if (r.deletedCount === 1) {
					resolve({ _id, status: 'DELETE_SUCCESS' })
				} else {
					resolve({ _id, status: 'DELETE_FAIL' })
				}
			})
		})
	}
}

export const users = {
	read (token) {
		var blah = getMember(token)
		console.log('member', blah)
		return { _id: 'testuserid' }
	}
}

