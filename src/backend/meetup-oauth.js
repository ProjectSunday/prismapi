import entities from 'entities'
import request from 'request'

import { OAUTH, URL } from './meetup'

export class MeetupOauth {
	constructor(context) {
		this.context = context
		this._data = {}
	}

	get data() { return this._data }
	set data(d) { this._data = d }

	async login() {
		var self = this

		return new Promise((resolve, reject) => {

			var myCookieJar = request.jar();

			var authUri = `${URL.OAUTH2_AUTHORIZE}?client_id=${OAUTH.CLIENT_ID}&response_type=token&scope=basic+event_management&redirect_uri=${OAUTH.REDIRECT_URI}`
			request.get({
				uri: authUri,
				jar: myCookieJar
			}, (e1, r1, b1) => {
				var token = b1.match(/name="token" value="(.*)"/)[1];

				var r = b1.match(/name="returnUri" value="(.*)"/);
				var returnUri = entities.decodeHTML(r[1])

				var op = b1.match(/name="op" value="(.*)"/)[1]

				var apiAppName = b1.match(/name="apiAppName" value="(.*)"/)[1]

				var loginUri = 'https://secure.meetup.com/login/'
				request.post({
					uri: loginUri,
					jar: myCookieJar,
					form: {
						email: self.context.meetupEmail,
						password: self.context.meetupPassword,
						rememberme: 'on',
						token,
						submitButton: 'Log in and Grant Access',
						returnUri,
						op,
						apiAppName
					}
				}, function (e2, r2, b2) {

					var meetupRedirectUri = r2.headers.location
					request.get({
						uri: meetupRedirectUri,
						followRedirect: false,
						jar: myCookieJar
					}, function (e3,r3,b3) {
						var location = r3.headers.location
						self.context.token = location.match(/access_token=([^&]*)/)[1]
						resolve()
					})
				})
			})
		})
	}

}