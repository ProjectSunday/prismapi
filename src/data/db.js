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

////////////////////////////////////////////////////////////////////////////////////

const QUERY = async (collection, filter) => {
	log('2222')
	var doc = await collection.find(filter).toArray()
	return doc[0]
}

const MUTATE = async (collection, filter, value) => {
	var doc = await collection.findOneAndUpdate(filter, { $set: value }, { upsert: true })

	if (doc.value) {
		return doc.value
	} else {
		var d = await collection.find({ _id: doc.lastErrorObject.upserted }).toArray()
		return d[0]
	}
}

////////////////////////////////////////////////////////////////////////////////////

const settings = {
	getAdministrator () {
		var collection = _db.collection('settings')
		return QUERY(collection, { name: 'administrator' })
	},
	updateAdministrator (value) {
		var collection = _db.collection('settings')
		return update(collection, { name: 'administrator'}, value)
	}
}


////////////////////////////////////////////////////////////////////////////////////
const category = {
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

////////////////////////////////////////////////////////////////////////////////////
const requestedClass = {
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


const user = {
	getFromMeetupProfile (meetup, token) {

		var c = _db.collection('users')
		var f = { 'meetup.id': meetup.id }
		var s = { meetup, token }

		return MUTATE(c, f, s)

	},

	read (token) {
		return new Promise((resolve, reject) => {
			_db.collection('users').find({ token }).toArray().then(r => {
				resolve(r[0])
			}).catch(reject)
		})
	}
}



// const MUTATE = (col, filter, set) => {
// 	return new Promise((resolve, reject) => {
// 		col.findOneAndUpdate(filter,
// 			{ $set: set },
// 			{ upsert: true }
// 		).then(r => {
// 			if (r.value) {
// 				resolve(r.value)
// 			} else {
// 				col.find({ _id: r.lastErrorObject.upserted }).then(u => {
// 					resolve(u[0])
// 				}, reject)
// 			}
// 		})
// 	})
// }



export default { category, requestedClass, settings, user }

