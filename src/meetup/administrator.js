import request from 'superagent'
import rest from 'rest'

import db from '~/data/db'

const URL_MEETUP_MEMBER_SELF = 'https://api.meetup.com/2/member/self'
const URL_MEETUP_ACCESSTOKEN = 'https://secure.meetup.com/oauth2/access'

const ADMINISTRATOR_ID = 182509367

const CLIENT_ID 	= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

const REFRESH_TOKEN = process.env.REFRESH_TOKEN || '78aa4d15cc8461bc8a0b6d80b1e371c6'


var _administrator = {
	startTokenMonitoring,
	access_token: null,
	created: null
}


async function startTokenMonitoring () {

	var administrator = await db.settings.getAdministrator() || {}

	console.log('Administrator')
	console.log('\trefresh_token: ', REFRESH_TOKEN)
	console.log('\taccess_token:  ', administrator.access_token)
	console.log('\tcreated:       ', administrator.created)
	console.log('\tage:           ', ((new Date()) - administrator.created) / 1000 / 60, 'minutes')

	if (!await accessTokenValid(administrator)) {

		console.log('NOT VALID!')

		var a = await refreshAccessToken()
		administrator = {
			access_token: a.access_token,
			created: new Date()
		}

		console.log('NEW Administrator \n\taccess_token: ', administrator.access_token)
		console.log('\tcreated:      ', administrator.created)
		console.log('\tage:          ', ((new Date()) - administrator.created) / 1000 / 60, 'minutes')

		await db.settings.setAdministrator(administrator)
	}

	_administrator.access_token = administrator.access_token
	_administrator.created = administrator.created

	clearTimeout(global.__prism_admin_timer_id)
	global.__prism_admin_timer_id = setTimeout(startTokenMonitoring, 60000)

}

async function accessTokenValid (administrator) {

	if (!administrator || !administrator.access_token) { return false }

	var now = new Date()
	var ageMinutes = (now - administrator.created) / 1000 / 60
	if (ageMinutes > 45) { return false }  //60 minutes is life span of access token

	var result = await rest({
		method: 'GET',
		headers: { Authorization: `Bearer ${administrator.access_token}` },
		path: URL_MEETUP_MEMBER_SELF
	})

	try {
		var self = JSON.parse(result.entity)
		return (self.id === ADMINISTRATOR_ID)
	} catch (err) {
		return false
	}

}


async function refreshAccessToken () {
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

	// console.log(result, 'result')

	var administrator
	try {
		administrator = JSON.parse(result.entity)
	} catch (err) {}

	if (!administrator || !administrator.access_token) {
		console.error('THE REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
		console.log('result:', administrator.error_description)
	} else {
		return administrator
	}

}



export default _administrator