import request from 'superagent'

import db from '~/data/db'

const URL_SELF = 'https://api.meetup.com/2/member/self'

const CLIENT_ID 	= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
const CLIENT_SECRET = process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

const REFRESH_TOKEN = process.env.REFRESH_TOKEN || 'cc249bba4f4233960e63b3832378521c'

var administrator = {
	access_token: null,
	tokenCreated: null
}

const accessTokenValid = () => {

	log(administrator.access_token, 'access_token:')
	log(REFRESH_TOKEN, 'REFRESH_TOKEN:')

	if (!administrator.access_token) { return false }

	return new Promise((resolve, reject) => {
		request
			.get(URL_SELF)
			.set({'Authorization': `Bearer ${administrator.access_token}` })
			.end((err, result) => {
				resolve(!err)
			})
	})
}

const accessTokenIsOld = () => {

	var tokenCreated = new Date(administrator.tokenCreated)
	var now = new Date()
	var tokenAge = now.getTime() - tokenCreated.getTime()

	log(tokenAge, 'tokenAge')
	return (tokenAge > 162000)
}

const refreshAccessToken = () => {
	var url = 'https://secure.meetup.com/oauth2/access' +
		'?client_id=' + CLIENT_ID +
		'&client_secret=' + CLIENT_SECRET +
		'&grant_type=refresh_token' +
		'&refresh_token=' + REFRESH_TOKEN

	request
		.post(url)
		.set({'Content-Type': 'application/x-www-form-urlencoded'})
		.end(function (err, result) {
			if (err) {
				console.error('THE REFRESH_TOKEN IS NOT WORKING, TELL HAI!')
			} else {
				administrator.access_token = result.body.access_token
				administrator.tokenCreated = new Date()
				log(administrator, 'Administrator token refreshed ->')
			}
		})

}

const monitorAccessToken = async () => {

	// var blah = await db.settings.updateAdministrator({ blah: 'blah1', 'blah2': 22222})
	log('1111;')
	var blah = await db.settings.getAdministrator()
	log(blah, '33333:')

	// var tokenCreated = new Date(administrator.tokenCreated)
	// var now = new Date()
	// var tokenAge = now.getTime() - tokenCreated.getTime()

	// if (!await accessTokenValid() || accessTokenIsOld()) {  //45 minutes
	// 	refreshAccessToken()
	// } else {
	// 	log('token valid')
	// }

	setTimeout(monitorAccessToken, 1000)
}

monitorAccessToken()

export default administrator