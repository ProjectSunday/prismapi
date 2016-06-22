import rest from 'rest'

import { Settings } from '~/data/db'

const URL_MEETUP_MEMBER_SELF = 'https://api.meetup.com/2/member/self'
const URL_MEETUP_ACCESSTOKEN = 'https://secure.meetup.com/oauth2/access'

const ADMINISTRATOR_ID = 182509367


const CLIENT_ID 	= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

const REFRESH_TOKEN 		= process.env.REFRESH_TOKEN 		|| '1f17e403279d3cd9d55ba29ada1f8cad'
// const AUTHORIZATION_CODE 	= process.env.AUTHORIZATION_CODE 	|| '4bd8c6e0f6e27675a380b552e99baeb0'

// var _administrator = {
// 	startTokenMonitoring,
// 	access_token: null,
// 	created: null
// }



var _instance

export default class Administrator {
	constructor() {
		if (_instance) {
			return _instance
		}
		_instance = this
	}

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

		if (!this.access_token) { return false }

		var now = new Date()
		var ageMinutes = (now - this.created) / 1000 / 60
		if (ageMinutes > 45) { return false }  //60 minutes is life span of access token

		var result = await rest({
			method: 'GET',
			headers: { Authorization: `Bearer ${this.access_token}` },
			path: URL_MEETUP_MEMBER_SELF
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
			path: URL_MEETUP_ACCESSTOKEN,
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
			Object.assign(this, administrator, { created: new Date() })
		}

	}

	async readFromDatabase() {
		var a = await Settings.getAdministrator()
		Object.assign(this, a)
	}

	async updateDatabase() {
		await Settings.setAdministrator(this)
	}

	logOutTokens(message) {
		console.log(`\n${message}`)
		console.log('\taccess_token:  ', this.access_token)
		console.log('\trefresh_token: ', this.refresh_token)
		console.log('\tcreated:       ', this.created)
		console.log('\tage:           ', ((new Date()) - this.created) / 1000 / 60, 'minutes\n')
	}



}







