import request from 'superagent'

const URL_SELF = 'https://api.meetup.com/2/member/self'

var administrator = {
	access_token: 'eded6ee35f39a62a307e22048fc34a90',
	refresh_token: 'cc249bba4f4233960e63b3832378521c',
	created: 'Thu Jun 09 2016 18:53:14 GMT-0400 (EDT)'
}


const accessTokenValid = () => {

	log(administrator.access_token, 'access_token:')
	log(administrator.refresh_token, 'refresh_token:')

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

const refreshAccessToken = () => {
	var url = 'https://secure.meetup.com/oauth2/access' +
		'?client_id=' + meetup.client_id +
		'&client_secret=' + meetup.client_secret +
		'&grant_type=refresh_token' +
		'&refresh_token=' + meetup.refresh_token

	request
		.post(url)
		.set({'Content-Type': 'application/x-www-form-urlencoded'})
		.end(function (e, r) {
			meetup.access_token = r.body.access_token
			meetup.refresh_token = r.body.refresh_token
			meetup.created = new Date()
			res.send(getMarkup())
		})

}

setInterval(async () => {
	if (!await accessTokenValid()) {
		refreshAccessToken()
	} else {
		log('token valid')
	}
}, 20000)


export default administrator