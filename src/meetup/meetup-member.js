import rest from 'rest'

const MEETUPAPI_MEMBER_SELF = 'https://api.meetup.com/2/member/self'

export default class Member {
	constructor(token) {
		if (!token) throw "An access token is required to create a meetup member"
		this.token = token
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async fetch () {

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.token}` },
			path: MEETUPAPI_MEMBER_SELF
		})

		result = JSON.parse(result.entity)
		if (!result) throw "Unable to get meetup member"
		if (result.problem) throw result.problem

		this.data = result
	}
}