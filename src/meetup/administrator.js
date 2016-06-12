import request from 'superagent'
import rest from 'rest'

import db from '~/data/db'

// const DB = db

const URL_MEETUP_MEMBER_SELF = 'https://api.meetup.com/2/member/self'
const URL_MEETUP_ACCESSTOKEN = 'https://secure.meetup.com/oauth2/access'

const CLIENT_ID 	= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'ddb69ff423eb061b4c2a377de1babff1'

const accessTokenValid = async (administrator) => {

	if (!administrator || !administrator.access_token) { return false }

	var { access_token } = administrator

	var result = await rest({
		method: 'GET',
		headers: {
			Authorization: `Bearer ${administrator.access_token}`
			// 'Content-Type': 'application/x-www-form-urlencoded'
		},
		path: URL_MEETUP_MEMBER_SELF
	})


	return new Promise((resolve, reject) => {
		request
			.get(URL_MEETUP_MEMBER_SELF)
			.set()
			.end((err, result) => {
				resolve(!err)
			})
	})
}

const accessTokenIsOld = () => {

	var tokenCreated = new Date(_administrator.tokenCreated)
	var now = new Date()
	var tokenAge = now.getTime() - tokenCreated.getTime()

	log(tokenAge, 'tokenAge')
	return (tokenAge > 162000)
}

const refreshAccessToken = async () => {

	// t('does this get ran')
	// var url =  +
	// 	'?client_id=' + CLIENT_ID +
	// 	'&client_secret=' + CLIENT_SECRET +
	// 	'&grant_type=refresh_token' +
	// 	'&refresh_token=' + REFRESH_TOKEN

	log(REFRESH_TOKEN, 'REFRESH_TOKEN')

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

	// request
	// 	.post(url)
	// 	.set({'Content-Type': 'application/x-www-form-urlencoded'})
	// 	.end(function (err, result) {
	// 		if (err) {
	// 			console.error('THE REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
	// 		} else {
	// 			resolve({
	// 				access_token: result.body.access_token,
	// 				created: new Date()
	// 			})
	// 		}
	// 	})

}

const monitorAccessToken = async () => {

	// var blah = await db.settings.updateAdministrator({ blah: 'blah1', 'blah2': 22222})
	console.log('111')

	log(whattheactualfuck, 'wtf')
	// var blah = db.settings.getAdministrator()
	// log(blah, '33333:')

	// var tokenCreated = new Date(_administrator.tokenCreated)
	// var now = new Date()
	// var tokenAge = now.getTime() - tokenCreated.getTime()

	// if (!await accessTokenValid() || accessTokenIsOld()) {  //45 minutes
	// 	refreshAccessToken()
	// } else {
	// 	log('token valid')
	// }

	// setTimeout(monitorAccessToken, 5000)
}

// monitorAccessToken()




const startTokenMonitoring = async () => {
	// log('token monitoring started')

	var administrator = await db.settings.getAdministrator()
	log(administrator)

	if (await accessTokenValid(administrator)) {

	// 	var a = await refreshAccessToken()
	// 	administrator = {
	// 		access_token: a.access_token,
	// 		created: new Date()
	// 	}

	// 	await db.settings.setAdministrator(administrator)

	// }

	// //if token is old
	// 	//refresh token

	// _administrator.access_token = administrator.access_token
	// _administrator.created = administrator.created

}

var _administrator = {
	startTokenMonitoring,
	access_token: null,
	tokenCreated: null
}

export default _administrator