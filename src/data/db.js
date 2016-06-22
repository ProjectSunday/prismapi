import * as Common from './db-common'


export Category from './db-category'
export User from './db-user'

export default { ...Common }



// console.log(Category, 'wtf')
// import * as user 		from './db-user'

// console.log(category, 'category')


// export default { Category: category.Category }

// export default { ...common, ...user,  }

// import { ObjectID } from 'mongodb'

// import { connect } from 'prism-mongo'


// import { Member, default as meetup, ensureOrganizer } from '~/meetup/meetup'


// ////////////////////////////////////////////////////////////////////////////////////

// const settings = {
// 	getAdministrator () {
// 		var collection = _db.collection('settings')
// 		return QUERY(collection, { name: 'administrator' })
// 	},
// 	setAdministrator (administrator) {
// 		var collection = _db.collection('settings')
// 		return MUTATE(collection, { name: 'administrator'}, administrator)
// 	}
// }


// ////////////////////////////////////////////////////////////////////////////////////
// const category = {
// 	create (category) {
// 		return new Promise((resolve, reject) => {
// 			var collection = _db.collection('categories')

// 			collection.insertOne(category)
// 			.then(r => {
// 				return collection.find({ _id: r.insertedId }).toArray()
// 			})
// 			.then(docs => {
// 				resolve(docs[0])
// 			}, reject)
// 		})
// 	},
// 	read (_id) {

// 		const readAll = new Promise((resolve, reject) => {
// 			var collection = _db.collection('categories')
// 			collection.find().toArray().then(resolve, reject)
// 		})

// 		const readOne = new Promise((resolve, reject) => {
// 			var collection = _db.collection('categories')
// 			collection.find({ _id: ObjectID(_id) }).toArray().then(result => {
// 				resolve(result[0])
// 			}, reject)
// 		})

// 		if (_id === undefined) {
// 			return readAll
// 		} else {
// 			return readOne
// 		}

// 	},
// 	delete (_id) {
// 		return new Promise((resolve, reject) => {
// 			var collection = _db.collection('categories')

// 			collection.deleteOne({ _id: ObjectID(_id) }).then((r) => {
// 				if (r.deletedCount === 1) {
// 					resolve({ _id, status: 'DELETE_SUCCESS' })
// 				} else {
// 					resolve({ _id, status: 'DELETE_FAIL' })
// 				}
// 			})
// 		})
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////
// const requestedClass = {
// 	create (requested) {
// 		return new Promise((resolve, reject) => {
// 			var collection = _db.collection('requestedclasses')
// 			collection.insertOne(requested).then(r => {
// 				return collection.find({ _id: r.insertedId }).toArray()
// 			}).then(docs => {
// 				resolve(docs[0])
// 			}, reject)
// 		})
// 	},
// 	read (_id) {
// 		return new Promise((resolve, reject) => {
// 			// if (_id === undefined) {
// 			// 	var query = {}
// 			// } else {
// 			// 	var query = { _id: ObjectID(_id) }
// 			// }
// 			// console.log('query,', query)
// 			var collection = _db.collection('requestedclasses')
// 			collection.find().toArray().then(resolve, reject)
// 		})
// 	},
// 	delete (_id) {
// 		return new Promise((resolve, reject) => {
// 			var collection = _db.collection('requestedclasses')
// 			collection.deleteOne({ _id: ObjectID(_id) }).then(r => {
// 				// console.log('r:', r)
// 				if (r.deletedCount === 1) {
// 					resolve({ _id, status: 'DELETE_SUCCESS' })
// 				} else {
// 					resolve({ _id, status: 'DELETE_FAIL' })
// 				}
// 			}, reject)
// 		})
// 	}
// }

// ////////////////////////////////////////////////////////////////////////////////////
// const upcomingClass = {
// 	query () {

// 	},
// 	mutate (_class) {
// 		var collection = _db.collection('upcomingclasses')
// 		var filter = _class._id ? { _id: _class._id } : {}
// 		return MUTATE(collection, filter, _class)
// 	}
// }
// ////////////////////////////////////////////////////////////////////////////////////

// const user = {
// 	getFromMeetupProfile (meetup, token) {

// 		var c = _db.collection('users')
// 		var f = { 'meetupProfile.id': meetupProfile.id }
// 		var s = { meetupProfile, token }

// 		return MUTATE(c, f, s)

// 	},

// 	read (token) {
// 		return new Promise((resolve, reject) => {
// 			_db.collection('users').find({ token }).toArray().then(r => {
// 				resolve(r[0])
// 			}).catch(reject)
// 		})
// 	}
// }

// //////////////////////////////////////////////////////////////////////

// export * from './db-user'

// //////////////////////////////////////////////////////////////////////

// export class UpcomingClass {
// 	constructor() {
// 		// this.user = user
// 	}
// 	async create(userToken, upcoming) {


// 		// log(User, 'user')

// 		var creator = new User(userToken)

// 		await creator.fetch()

// 		log(creator, 'creator')




// 		// var user = await db.user.read(args.token)
// 		// log(user, 'user')


// 		await meetup.ensureOrganizer(creator)

// 		// await meetup.ensureOrganizer(user)

// 		// var newEvent = {
// 		// 	name: args.name
// 		// }
// 		// var event = await meetup.postEvent(user.token, newEvent)

// 		// log(event, 'event')

// 		// var newClass = {
// 		// 	teacher: [ user._id ],
// 		// 	meetupEvent: event
// 		// }
// 		// return await db.upcomingClass.mutate(newClass)

// 		//post event

// 		return { _id: 'blah' }

// 	}
// 	save() {
// 		log(this, 'this')
// 	}
// 	async fetch() {
// 		if (!this.token) { throw 'Not authorized.' }

// 		var users = await _db.collection('users').find({ 'meetupMember.token': this.token }).toArray()
// 		if (!users.length) { throw 'User not found.' }

// 		//also get meetup profile here

// 		Object.assign(this, users[0])
// 	}
// }



// export default { category, requestedClass, settings, start, upcomingClass, user }

