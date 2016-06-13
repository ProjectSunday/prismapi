import request from 'superagent'
import rest from 'rest'

import db from '~/data/db'

// const DB = db

var ADMINISTRATOR_TIMER_ID

const URL_MEETUP_MEMBER_SELF = 'https://api.meetup.com/2/member/self'
const URL_MEETUP_ACCESSTOKEN = 'https://secure.meetup.com/oauth2/access'

const PRISM_ADMINISTRATOR_ID = 182509367

const CLIENT_ID 	= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'ddb69ff423eb061b4c2a377de1babff1'

const accessTokenValid = async (administrator) => {

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
		return (self.id === PRISM_ADMINISTRATOR_ID)
	} catch (err) {
		return false
	}

}

const accessTokenIsOld = () => {

	var tokenCreated = new Date(_administrator.tokenCreated)
	var now = new Date()
	var tokenAge = now.getTime() - tokenCreated.getTime()

	log(tokenAge, 'tokenAge')
	return (tokenAge > 162000)
}

const refreshAccessToken = async () => {
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

	var administrator
	try {
		administrator = JSON.parse(result.entity)
	} catch (err) {}

	if (!administrator || !administrator.access_token) {
		console.error('THE REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
	} else {
		return administrator
	}

}

const startTokenMonitoring = async () => {

	var administrator = await db.settings.getAdministrator()

	console.log('Administrator \n\taccess_token: ', administrator.access_token)
	console.log('\tcreated:      ', administrator.created)
	console.log('\tage:          ', ((new Date()) - administrator.created) / 1000 / 60, 'minutes')

	if (!await accessTokenValid(administrator)) {

		console.log('EXPIRE!')

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

var _administrator = {
	startTokenMonitoring,
	access_token: null,
	created: null
}

export default _administrator