import rest from 'rest'

import { Settings } from './backend'
import { ADMINISTRATOR_ID, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN, URL } from './meetup'


var _instance

export class Administrator {
	constructor() {
		if (_instance) {
			return _instance
		}
		_instance = this
	}

	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async startTokenMonitoring () {

		await this.readFromDatabase()

		this.logOutTokens('Administrator')

		if (!await this.accessTokenValid()) {

			console.log('NOT VALID!')

			await this.refreshAccessToken()

			this.logOutTokens('NEW Administrator')

			await this.updateDatabase(this)
		}


		clearTimeout(global.__prism_admin_timer_id)
		global.__prism_admin_timer_id = setTimeout(this.startTokenMonitoring, 60000)


	}


	async accessTokenValid () {

		if (!this.data.access_token) { return false }

		var now = new Date()
		var ageMinutes = (now - this.data.created) / 1000 / 60
		if (ageMinutes > 45) { return false }  //60 minutes is life span of access token

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.data.access_token}` },
			path: URL.MEMBER_SELF
		})

		try {
			var self = JSON.parse(result.entity)
			return (self.id === ADMINISTRATOR_ID)
		} catch (err) {
			return false
		}

	}

	async refreshAccessToken () {

		var result = await rest({
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			path: URL.OAUTH2_ACCESS,
			params: {
				client_id: CLIENT_ID,
				client_secret: CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: REFRESH_TOKEN
			}
		})

		var administrator = JSON.parse(result.entity)

		if (!administrator || !administrator.access_token) {
			console.error('THE REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
			console.log('result:', administrator.error_description)
		} else {
			this.data = Object.assign({}, administrator, { created: new Date() })
		}

	}

	async readFromDatabase() {
		this.data = await Settings.getAdministrator()
	}

	async updateDatabase() {
		await Settings.setAdministrator(this.data)
	}

	logOutTokens(message) {
		console.log(`\n${message}`)
		console.log('\taccess_token:  ', this.data.access_token)
		console.log('\trefresh_token: ', this.data.refresh_token)
		console.log('\tcreated:       ', this.data.created)
		console.log('\tage:           ', ((new Date()) - this.data.created) / 1000 / 60, 'minutes\n')
	}

}







