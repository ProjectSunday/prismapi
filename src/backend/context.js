// IMPORTANT!
// Make sure context is only used with graphql, other modules have their own data.
export class Context {
	constructor() {
		this._data = {
			session: {
				user: {
					access_token: undefined,
					meetup: {
						email: undefined,
						password: undefined,
					}
				}
			}
		}
	}
	
	get data() { return this._data }
	set data(v) { this._data = v }

	get token() { return this._data.session.user.access_token }
	set token(v) { this._data.session.user.access_token = v }

	get meetupEmail() { return this._data.session.user.meetup.email }
	set meetupEmail(v) { this._data.session.user.meetup.email = v }

	get meetupPassword() { return this._data.session.user.meetup.password }
	set meetupPassword(v) { this._data.session.user.meetup.password = v }

}