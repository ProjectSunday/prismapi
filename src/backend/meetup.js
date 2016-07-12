import rest from 'rest'


export const ADMIN = {
	ID: 			process.env.ADMIN_ID 			|| 182509367,
	API_KEY: 		process.env.ADMIN_API_KEY 		|| '7d156b614b6d5c5e7d357e18151568',
	REFRESH_TOKEN: 	process.env.ADMIN_REFRESH_TOKEN

}


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
	MEMBERS					: api + group + 'members',

	MEMBER_SELF				: api + '2/member/self',
    PROFILE					: api + '2/profile',

	OAUTH2_ACCESS			: 'https://secure.meetup.com/oauth2/access',
	OAUTH2_AUTHORIZE		: 'https://secure.meetup.com/oauth2/authorize'
}

export const request = async (options) => {
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

