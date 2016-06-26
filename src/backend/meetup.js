//administrator
export const ADMINISTRATOR_ID = 182509367


//security
export const PRISMAPIKEY 	= process.env.PRISMAPIKEY	|| '7d156b614b6d5c5e7d357e18151568'

export const CLIENT_ID 		= process.env.CLIENT_ID 	|| 'sgeirri963sprv1a1vh3r8cp3o'
export const CLIENT_SECRET 	= process.env.CLIENT_SECRET || '72ifhdnu3s76fk87tg60tqb8m9'
export const REDIRECT_URI 	= process.env.REDIRECT_URI	|| 'http://localhost:7000/authentication'

export const ADMIN_REFRESH_TOKEN 	= process.env.ADMIN_REFRESH_TOKEN || 'a7675c6ac80992dc48eb22fc4cee6cf7'


//local learner
export const PRISMGROUPID 	= process.env.PRISMGROUPID 		|| 18049722
export const PRISMGROUPNAME = process.env.PRISMGROUPNAME 	|| 'locallearners'


//url
export const URL = {
	POSTEVENT: 'https://api.meetup.com/locallearners/events',
	DELETEEVENT: 'https://api.meetup.com/locallearners/events',
	LOCALLEARNERS_EVENTS: 'https://api.meetup.com/locallearners/events',
	MEMBER_SELF: 'https://api.meetup.com/2/member/self',
	MEMBERS: 'https://api.meetup.com/LocalLearners/members/',
	OAUTH2_ACCESS: 'https://secure.meetup.com/oauth2/access',
    PROFILE: 'https://api.meetup.com/2/profile',
    TEST: 'https://api.meetup.com/2/events'
}


export * from './meetup-administrator'
export * from './meetup-event'
export * from './meetup-member'

