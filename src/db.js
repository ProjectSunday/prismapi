import { MongoClient } from 'mongodb'

var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'

var _db


export const categories = () => {
	return _db.collection('categories')
}

export const requestedClasses = () => {
	return _db.collection('requestedclasses')
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
