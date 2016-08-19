import entities from 'entities'
import rest from 'rest'
import request from 'request'


import { Administrator } from './backend'

export const ADMIN = {
	ID: 			process.env.ADMIN_ID 			|| 182509367,
	API_KEY: 		process.env.ADMIN_API_KEY 		|| '7d156b614b6d5c5e7d357e18151568',
	REFRESH_TOKEN: 	process.env.ADMIN_REFRESH_TOKEN,
}

var ADMIN_EMAIL		= process.env.ADMIN_EMAIL		|| 'prismbravo2016@gmail.com'
var ADMIN_PASSWORD 	= process.env.ADMIN_PASSWORD	|| 'thirstyscholar1'


export const OAUTH = {
	CLIENT_ID: 		process.env.OAUTH_CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o',
	CLIENT_SECRET: 	process.env.OAUTH_CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9',
	REDIRECT_URI: 	process.env.OAUTH_REDIRECT_URI	|| 'http://localhost:7000/authentication'
}


export const GROUP = {
	ID: 	process.env.GROUP_ID 	|| 18049722,
	NAME: 	process.env.GROUP_NAME 	|| 'locallearners'
}


const api = 'https://api.meetup.com/'
const group = 'locallearners/'
export const URL = {
	EVENTS					: api + group + 'events',
	
	LOGIN					: 'https://secure.meetup.com/login/',

	MEMBERS					: api + group + 'members',

	MEMBER_SELF				: api + '2/member/self',
    PROFILE					: api + '2/profile',

	OAUTH2_ACCESS			: 'https://secure.meetup.com/oauth2/access',
	OAUTH2_AUTHORIZE		: 'https://secure.meetup.com/oauth2/authorize'


}

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


export * from './meetup-event'
export * from './meetup-member'
export * from './meetup-oauth'


////////////////////////////////////////////////////////////////////////////////////////////////////
//Administrator
////////////////////////////////////////////////////////////////////////////////////////////////////

export const Administrator2 = {
	promoteUser: async (args) => {

		var adminToken = await OAuth2.getToken({
			email: ADMIN_EMAIL,
			password: ADMIN_PASSWORD,
			scope: 'basic+event_management+profile_edit'
		})

		// var administrator = new Administrator()

		var result = await meetupRest({
			method: 'PATCH',
			headers: { Authorization: `Bearer ${adminToken}` },
			path: `${URL.MEMBERS}/${args.id}`,
			params: {
				add_role: 'event_organizer'
			}
		})

		if (result && result.group_profile) {
			return result
		} else {
			console.log('Administrator2.promoteUser() error')
			console.log(result)
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//Event
////////////////////////////////////////////////////////////////////////////////////////////////////

export const deleteEvent = async (args) => {
	var result = await meetupRest({
		method: 'DELETE',
		headers: { 'Authorization': `Bearer ${args.token}` },
		path: URL.EVENTS + `/${args.id}`
	})

	if (result.errors && result.errors[0].message === 'event was deleted') {
		return { status: 'DELETE_SUCCESS' }
	}

	if (result.status.code === 204 ) {
		return { status: 'DELETE_SUCCESS' }
	}

	throw 'Error deleting meetup event with args: ' + JSON.stringify(args)
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//Member
////////////////////////////////////////////////////////////////////////////////////////////////////

export const Member2 = {
	get: async (args) => {
		var member = await meetupRest({
			method: 'GET',
			headers: {
				Authorization: `Bearer ${args.token}`,
				'X-Meta-Photo-Host': 'secure'
			},
			path: URL.MEMBERS + '/self'
		})
		if (member.errors) {
			console.log('Meetup Member2 errors:', member.errors, 'args:', args)
			throw member.errors[0]
		}
		if (member.problem) throw member.problem
		if (!member || !member.id) throw "Unable to get meetup member"

		return member
	},
	getRole: async (args) => {
		var result = await meetupRest({
			method: 'GET',
			path: `${URL.PROFILE}/${GROUP.ID}/${args.id}?key=${ADMIN.API_KEY}&sign=true`
		})
		return result.role
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//OAuth
////////////////////////////////////////////////////////////////////////////////////////////////////

export const OAuth2 = {

	getToken: async ({ email, password, scope }) => {
		scope = scope || 'basic+event_management'

		var thisRequest = request
		var thisCookieJar = thisRequest.jar()

		var loginDetails = await pullUpMeetupLoginPage()
		var uri = await getRedirectUri(loginDetails)
		var token = await getTokenFromRedirect(uri)

		return token

		async function pullUpMeetupLoginPage() {
			var { body } = await asyncRequest({
				method: 'GET',
				uri:`${URL.OAUTH2_AUTHORIZE}?client_id=${OAUTH.CLIENT_ID}&response_type=token&scope=${scope}&redirect_uri=${OAUTH.REDIRECT_URI}`,
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
			var { body, resp } = await asyncRequest({
				method: 'POST',
				uri: URL.LOGIN,
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

		async function getTokenFromRedirect(uri) {
			var { resp } = await asyncRequest({
				method: 'GET',
				uri,
				followRedirect: false,
				jar: thisCookieJar
			}, thisRequest)

			var location = resp.headers.location
			var token = location.match(/access_token=([^&]*)/)[1]
			return token
		}


	}

}



