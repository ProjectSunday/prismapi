import rest from 'rest'

import { Context } from '~/backend/backend'
import { Read, Update } from './db'
import { ADMIN, Member, OAUTH, request, URL} from './meetup'

var _data = {}

export class Administrator {

	static get data() { return _data }
	static set data(d) { _data = d }

	static async startTokenMonitoring () {

		this.data = await Read('settings', { name: 'administrator' })

		if (ADMIN.REFRESH_TOKEN) {
			this.data.refresh_token = ADMIN.REFRESH_TOKEN
		}

		this.logOutTokens('Administrator')

		t(2)
		if (!await this.accessTokenValid()) {
			t(2.5)
			console.log('NOT VALID!')

			await this.refreshAccessToken()

			this.logOutTokens('NEW Administrator')

			await Update('settings', { name: 'administrator' }, this.data)
			t(3)
		}
		t(4)

		clearTimeout(global.__prism_admin_timer_id)
		global.__prism_admin_timer_id = setTimeout(() => {
			this.startTokenMonitoring()
		}, 6e4)

	}


	static async accessTokenValid () {

		if (!this.data.access_token) { return false }

		var now = new Date()
		var ageMinutes = (now - this.data.created) / 1000 / 60
		if (ageMinutes > 45) { return false }  //60 minutes is life span of access token

		var context = new Context()
		context.user.token = this.data.access_token
		await new Member(context).fetch()

		return (context.user.meetupMember.id === ADMIN.ID)

	}

	static async refreshAccessToken () {

		var result = await request({
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			path: URL.OAUTH2_ACCESS,
			params: {
				client_id: OAUTH.CLIENT_ID,
				client_secret: OAUTH.CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: this.data.refresh_token
			}
		})


		if (!result || !result.access_token) {
			console.error('THE ADMIN.REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
			console.log('result:', result.error_description)
		} else {
			this.data = {
				refresh_token: result.refresh_token,
				access_token: result.access_token,
				created: new Date()
			}
		}

	}

	static logOutTokens(message) {
		console.log(`\n${message}`)
		console.log('\tREFRESH_TOKEN: ', this.data.refresh_token)
		console.log('\taccess_token:  ', this.data.access_token)
		console.log('\tcreated:       ', this.data.created)
		console.log('\tage:           ', ((new Date()) - this.data.created) / 1000 / 60, 'minutes\n')
	}

}







