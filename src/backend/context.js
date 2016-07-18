// IMPORTANT!
// Make sure context is only used with graphql, other modules have their own data.
export class Context {
	constructor() {
		// initialData = initialData || {}
		this.meetupEmail = null
		this.meetupPassword = null

		// this._data = {
		// 	session: {
		// 		user: {
		// 			access_token: undefined,
		// 			meetup: {
		// 				email: undefined,
		// 				password: undefined,
		// 			}
		// 		}
		// 	}
		// }

		this.requestedClass = {}
		this.requestedClasses = []

		this.user = {
			token: null,
			meetupMember: {
				role: undefined
			}
		}

		this.upcomingClass = {
			event: {}
		}
		this.upcomingClasses = []

		// Object.assign(this, initialData)
	}
	
	// get data() { return this._data }
	// set data(v) { this._data = v }

	// // get token() { return this._data.session.user.access_token }
	// // set token(v) { this._data.session.user.access_token = v }

	// get meetupEmail() { return this._data.session.user.meetup.email }
	// set meetupEmail(v) { this._data.session.user.meetup.email = v }

	// get meetupPassword() { return this._data.session.user.meetup.password }
	// set meetupPassword(v) { this._data.session.user.meetup.password = v }

	get userIsTeacher() {
		// log(this.user._id, 'userIsTeacher user._id')
		// log(this.upcomingClass.teacher, 'userIsTeacher teacher _id')
		// console.log(this.user._id.equals(this.upcomingClass.teacher), 'comparison')
		return this.user._id.equals(this.upcomingClass.teacher)
	}

}