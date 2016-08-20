import entities from 'entities'
import rest from 'rest'
import request from 'request'


const ADMIN_API_KEY = process.env.ADMIN_API_KEY ||
	'7d156b614b6d5c5e7d357e18151568'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ||
	'prismcharlie2016@gmail.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ||
	'thirstyscholar1'


const GROUP_ID 		= 18049722
const GROUP_NAME 	= 'locallearners'


const MEETUP_EVENTS_URL = 
	`https://api.meetup.com/locallearners/events`
const MEETUP_MEMBERS_URL =
	`https://api.meetup.com/locallearners/members`
const MEETUP_PROFILE_URL =
	`https://api.meetup.com/2/profile`


const MEETUP_OAUTH_AUTHORIZE_URL =
	'https://secure.meetup.com/oauth2/authorize'
const MEETUP_OAUTH_ACCESS_URL =
	'https://secure.meetup.com/oauth2/access'
const MEETUP_OAUTH_CLIENT_ID = process.env.MEETUP_OAUTH_CLIENT_ID ||
	'sgeirri963sprv1a1vh3r8cp3o'
const MEETUP_OAUTH_CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET ||
	'72ifhdnu3s76fk87tg60tqb8m9'
const MEETUP_OAUTH_REDIRECT_URI = process.env.MEETUP_OAUTH_REDIRECT_URI ||
	'http://localhost:7000/authentication'


const MEETUP_LOGIN_URL =
	'https://secure.meetup.com/login/'


////////////////////////////////////////////////////////////////////////////////////////////////////
function asyncRequest (args, requester) {
	requester = requester || request
	return new Promise((resolve, reject) => {
		requester(args, (error, resp, body) => {
			if (error) {
				console.log('asyncRequest() error:', error)
				reject(error)
			}
			resolve({ resp, body })
		})
	})
}

export const meetupRest = async (options) => {
	var result = await rest({ ...options })
	// console.log('result', result.status)

	if (result.status.code === 204) {
		// console.log(result)
		return result
	}
	// if (result.status.code !== 200) throw 'meetup.request status code ' + result.status.code
	return JSON.parse(result.entity)
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//Event
////////////////////////////////////////////////////////////////////////////////////////////////////
export const Event = {
	post: async (args) => {
		var result = await meetupRest({
			method: 'POST',
			headers: { 'Authorization': `Bearer ${args.token}` },
			path: MEETUP_EVENTS_URL,
			params: args.newEvent
		})

		if (result.errors) throw result.errors[0].message

		return result
	},
	delete: async (args) => {
		var result = await meetupRest({
			method: 'DELETE',
			headers: { 'Authorization': `Bearer ${args.token}` },
			path: `${MEETUP_EVENTS_URL}/${args.id}`
		})

		if (result.errors && result.errors[0].message === 'event was deleted') {
			return { status: 'DELETE_SUCCESS' }
		}

		if (result.status.code === 204 ) {
			return { status: 'DELETE_SUCCESS' }
		}

		throw 'Error deleting meetup event with args: ' + JSON.stringify(args)
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//Member
////////////////////////////////////////////////////////////////////////////////////////////////////
export const Member = {
	get: async (args) => {
		var member = await meetupRest({
			method: 'GET',
			headers: {
				Authorization: `Bearer ${args.token}`,
				'X-Meta-Photo-Host': 'secure'
			},
			path: MEETUP_MEMBERS_URL + '/self'
		})
		if (member.errors) {
			console.log('Meetup Member.get() errors:', member.errors, 'args:', args)
			throw member.errors[0]
		}
		if (member.problem) throw member.problem
		if (!member || !member.id) throw "Unable to get meetup member"

		return member
	},
	addRole: async (args) => {
		var result = await meetupRest({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${args.adminToken}` },
			path: `${MEETUP_MEMBERS_URL}/${args.id}`,
			params: {
				add_role: args.role
			}
		})
		return result
	},
	getRole: async (args) => {
		var result = await meetupRest({
			method: 'GET',
			path: `${MEETUP_PROFILE_URL}/${GROUP_ID}/${args.id}?key=${ADMIN_API_KEY}&sign=true`
		})
		return result.role
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//OAuth
////////////////////////////////////////////////////////////////////////////////////////////////////
export const OAuth = {
	authorize: async ({ email, password, scope }) => {
		scope = scope || 'basic+event_management'

		var thisRequest = request
		var thisCookieJar = thisRequest.jar()

		var loginDetails = await pullUpMeetupLoginPage()
		var uri = await getRedirectUri(loginDetails)
		var code = await getCodeFromRedirect(uri)
		var tokens = await getTokensFromCode(code)
		tokens.created = new Date()

		return tokens


		async function pullUpMeetupLoginPage() {
			var { body } = await asyncRequest({
				method: 'GET',
				uri:`${MEETUP_OAUTH_AUTHORIZE_URL}?client_id=${MEETUP_OAUTH_CLIENT_ID}&response_type=code&scope=${scope}&redirect_uri=${MEETUP_OAUTH_REDIRECT_URI}`,
				jar: thisCookieJar
			}, thisRequest)

			var token = body.match(/name="token" value="(.*)"/)[1];

			var r = body.match(/name="returnUri" value="(.*)"/);
			var returnUri = entities.decodeHTML(r[1])

			var op = body.match(/name="op" value="(.*)"/)[1]

			var apiAppName = body.match(/name="apiAppName" value="(.*)"/)[1]

			return { token, returnUri, op, apiAppName }
		}

		async function getRedirectUri (args) {
			var { token, returnUri, op, apiAppName } = args
			var { resp } = await asyncRequest({
				method: 'POST',
				uri: MEETUP_LOGIN_URL,
				jar: thisCookieJar,
				form: {
					email,
					password,
					rememberme: 'on',
					token,
					submitButton: 'Log in and Grant Access',
					returnUri,
					op,
					apiAppName
				}
			}, thisRequest)

			var uri = resp.headers.location

			if (!uri) {
				console.log('OAuth2.getToken() error: unable to get redirect uri.  Resp:', resp)
				throw 'OAuth2.getToken() error: unable to get redirect uri'
			}
			return uri
		}

		async function getCodeFromRedirect(uri) {
			var { resp } = await asyncRequest({
				method: 'GET',
				uri,
				followRedirect: false,
				jar: thisCookieJar
			}, thisRequest)

			var location = resp.headers.location
			var code = location.match(/code=(.*)$/)[1]
			return code
		}

		async function getTokensFromCode(code) {
			var { body, resp } = await asyncRequest({
				method: 'POST',
				uri: `${MEETUP_OAUTH_ACCESS_URL}?client_id=${MEETUP_OAUTH_CLIENT_ID}&client_secret=${MEETUP_OAUTH_CLIENT_SECRET}&grant_type=authorization_code&redirect_uri=${MEETUP_OAUTH_REDIRECT_URI}&code=${code}`,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			return JSON.parse(body)
		}
	}
}



