import rest from 'rest'


//administrator
export const ADMINISTRATOR_ID		= 182509367
export const ADMIN_REFRESH_TOKEN	= process.env.ADMIN_REFRESH_TOKEN || '8f911109da4ac924b8b127cf799e44d0'


//security
export const PRISMAPIKEY 	= process.env.PRISMAPIKEY	|| '7d156b614b6d5c5e7d357e18151568'

export const CLIENT_ID 		= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
export const CLIENT_SECRET 	= process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
export const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'



//prism
export const PRISMGROUPID 	= process.env.PRISMGROUPID 		|| 18049722
export const PRISMGROUPNAME = process.env.PRISMGROUPNAME 	|| 'locallearners'


//url
const api = 'https://api.meetup.com/'
const group = 'locallearners/'
export const URL = {
	EVENTS					: api + group + 'events',
	MEMBERS					: api + group + 'members',

	MEMBER_SELF				: api + '2/member/self',
    PROFILE					: api + '2/profile',

	OAUTH2_ACCESS			: 'https://secure.meetup.com/oauth2/access',
}

//request
export const request = async (options) => {
	var result = await rest({ ...options })
	return JSON.parse(result.entity)
}


export * from './meetup-administrator'
export * from './meetup-event'
export * from './meetup-member'

