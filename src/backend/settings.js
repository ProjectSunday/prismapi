import { ObjectID } from 'mongodb'

import { Delete, Query, QueryAll, Mutate, Read, Update } from './db'


// var _instance

export class Settings {
	// constructor() {
	// 	t()
	// 	if (_instance) return _instance

	// 	_instance = this
	// }

	static async getAdministrator() {
		return await Read('settings', { name: 'administrator' })
	}


	static async setAdministrator(administrator) {
		return await Update('settings', { name: 'administrator' }, administrator)
	}
	// async save(category) {

	// 	var c = await Mutate('categories', {}, category)
	// 	Object.assign(this._data, c)
	// 	return this._data

	// }
	// fetch() {

	// }

	// async getAll() {
	// 	return await QueryAll('categories')
	// }

	// // read (_id) {

	// // 	const readAll = new Promise((resolve, reject) => {
	// // 		var collection = _db.collection('categories')
	// // 		collection.find().toArray().then(resolve, reject)
	// // 	})

	// // 	const readOne = new Promise((resolve, reject) => {
	// // 		var collection = _db.collection('categories')
	// // 		collection.find({ _id: ObjectID(_id) }).toArray().then(result => {
	// // 			resolve(result[0])
	// // 		}, reject)
	// // 	})

	// // 	if (_id === undefined) {
	// // 		return readAll
	// // 	} else {
	// // 		return readOne
	// // 	}

	// // },
	// async delete (_id) {
	// 	var s = await Delete('categories', { _id: ObjectID(_id) })
	// 	Object.assign(this._data, s, { _id: _id })
	// 	return this._data
	// }
}

