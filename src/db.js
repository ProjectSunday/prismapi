import { MongoClient, ObjectID } from 'mongodb'

var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'

var _db

export const requestedClasses = {
	create (requested) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.insertOne(requested).then(r => {
				return collection.find({ _id: r.insertedId }).toArray()
			}).then(docs => {
				var requested = docs[0]
				requested.id = docs[0]._id
				resolve(requested)
			}, reject)
		})
	},
	read () {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.find().toArray().then(result => {
				var requested = result.map(r => {
					r.id = r._id
					delete r._id
					return r
				})
				resolve(requested)
			}, reject)
		})
	},
	delete (id) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('requestedclasses')
			collection.deleteOne({ _id: ObjectID(id) }).then(r => {
				// console.log('r:', r)
				if (r.deletedCount === 1) {
					resolve({ id, status: 'DELETE_SUCCESS' })
				} else {
					resolve({ id, status: 'DELETE_FAIL' })
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
				var cat = docs[0]
				cat.id = docs[0]._id
				resolve(cat)
			}, reject)
		})
	},
	read () {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('categories')
			collection.find().toArray().then(result => {
				var categories = result.map(r => {
					r.id = r._id
					delete r._id
					return r
				})
				resolve(categories)
			}, reject)
		})
	},
	delete (id) {
		return new Promise((resolve, reject) => {
			var collection = _db.collection('categories')

			collection.deleteOne({ _id: ObjectID(id) }).then((r) => {
				if (r.deletedCount === 1) {
					resolve({ id, status: 'DELETE_SUCCESS' })
				} else {
					resolve({ id, status: 'DELETE_FAIL' })
				}
			})
		})
	}
}

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
