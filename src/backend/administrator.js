import rest from 'rest'

import { Context } from '~/backend/backend'
import { Read, Update } from './db'
import { ADMIN, Member, OAUTH, request, URL} from './meetup'

var _singleton

export class Administrator {

	constructor() {
		if (!_singleton) _singleton = this
		return _singleton
	}

	get() {
		return {
			access_token: this.access_token,
			created: this.created,
			refresh_token: this.refresh_token
		}
	}

	async startTokenMonitoring () {

		var admin = await Read('settings', { name: 'administrator' })
		Object.assign(this, admin)

		if (ADMIN.REFRESH_TOKEN) {
			this.refresh_token = ADMIN.REFRESH_TOKEN
		}

		this.logOutTokens('Administrator')
		if (!await this.accessTokenValid()) {
			console.log('NOT VALID!')
			await this.refreshAccessToken()
			this.logOutTokens('NEW Administrator')

			await Update('settings', { name: 'administrator' }, this.get())
		}

		clearTimeout(global.__prism_admin_timer_id)
		global.__prism_admin_timer_id = setTimeout(() => {
			this.startTokenMonitoring()
		}, 6e4)

	}


	async accessTokenValid () {
		if (!this.access_token) { return false }

		var now = new Date()
		var ageMinutes = (now - this.created) / 1000 / 60
		if (ageMinutes > 45) { return false }  //60 minutes is life span of access token

		var member = await Member.fetch(this.access_token)

		return (member.id === ADMIN.ID)
	}

	async refreshAccessToken () {

		var result = await request({
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			path: URL.OAUTH2_ACCESS,
			params: {
				client_id: OAUTH.CLIENT_ID,
				client_secret: OAUTH.CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: this.refresh_token
			}
		})


		if (!result || !result.access_token) {
			console.error('THE ADMIN.REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
			console.log('result:', result.error_description)
		} else {
			this.refresh_token = result.refresh_token
			this.access_token = result.access_token
			this.created = new Date()
		}

	}

	logOutTokens(message) {
		console.log(`\n${message}`)
		console.log('\tREFRESH_TOKEN: ', this.refresh_token)
		console.log('\taccess_token:  ', this.access_token)
		console.log('\tcreated:       ', this.created)
		console.log('\tage:           ', ((new Date()) - this.created) / 1000 / 60, 'minutes\n')
	}

}







