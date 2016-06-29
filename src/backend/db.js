import { MongoClient, ObjectID } from 'mongodb'

var PRISM_MONGO_CONNECTION_STRING = process.env.PRISM_MONGO_CONNECTION_STRING || 'mongodb://localhost:27017/prism'

var _db

export const connect = async () => {

	try {
		_db = await MongoClient.connect(PRISM_MONGO_CONNECTION_STRING)
	    console.log('=====> Connected to mongo server:', PRISM_MONGO_CONNECTION_STRING);
	} catch (err) {
	    console.error('Unable to connect to mongo server.')
	}

}

export const Create = async (collection, value) => {
	var r = await _db.collection(collection).insertOne(value)
	var i = await _db.collection(collection).find({ _id: r.insertedId }).toArray()
	return i[0]
}
export const Delete = async (collection, filter) => {
	var r = await _db.collection(collection).deleteOne(filter)

	if (r.deletedCount === 1) {
		return { status: 'DELETE_SUCCESS' }
	} else {
		return { status: 'DELETE_FAIL' }
	}
}




export const Query = async (collection, filter) => {
	var doc = await _db.collection(collection).find(filter).toArray()
	return doc[0]
}

export const QueryAll = async (collection) => {
	return await _db.collection(collection).find({}).toArray()
}

export const Mutate = async (collection, filter, value) => {
	var doc = await _db.collection(collection).findOneAndUpdate(filter, { $set: value }, { upsert: true })

	if (doc.lastErrorObject.updatedExisting) {
		return (await _db.collection(collection).find({ _id: doc.value._id }).toArray())[0]
	}

	if (doc.value) {
		return doc.value
	} else {
		return (await _db.collection(collection).find({ _id: doc.lastErrorObject.upserted }).toArray())[0]
	}

}

export const Read = async (collection, filter) => {
	var r = await _db.collection(collection).find(filter).toArray()

	// if (r.length > 1) {
	// 	throw 'DB error: more than one result for read operation on collection: ' + collection
	// }
	// if (r.length < 1) {
	// 	throw 'DB error: no result for read operation on collection: ' + collection
	// }

	return r[0]
}

export const ReadMany = async (collection, filter) => {
	return await _db.collection(collection).find(filter).toArray()
}

export const Update = async (collection, filter, value) => {
	if (typeof collection !== 'string') throw 'DB.Update error: collection name must be a string'

	var doc = await _db.collection(collection).findOneAndUpdate(filter, { $set: value }, { upsert: true })

	if (doc.lastErrorObject.updatedExisting) {
		return (await _db.collection(collection).find({ _id: doc.value._id }).toArray())[0]
	}

	if (doc.value) {
		return doc.value
	} else {
		return (await _db.collection(collection).find({ _id: doc.lastErrorObject.upserted }).toArray())[0]
	}

}

export default { Create, Delete, Read, ReadMany, Update }

