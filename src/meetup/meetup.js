import request from 'superagent'

import rest from 'rest'

import administrator from './administrator'

const PRISMGROUPID = 18049722
const PRISMGROUPNAME = 'locallearners'

const PRISMAPIKEY = '7d156b614b6d5c5e7d357e18151568'

const URL = {
	POSTEVENT: 'https://api.meetup.com/locallearners/events',
	DELETEEVENT: 'https://api.meetup.com/locallearners/events',

	MEMBER: 'https://api.meetup.com/2/member/self',
	MEMBERS: 'https://api.meetup.com/LocalLearners/members/',
    PROFILE: 'https://api.meetup.com/2/profile',
    TEST: 'https://api.meetup.com/2/events'
}

async function ensureOrganizer(user) {
	var role = await getRole(user.token)
    if (role !== 'Event Organizer' || role !== 'Organizer') {
		var meetupProfile = await promoteMember(user)


		// { meetupProfile: }
		// await db.user.mutate(
		// 	{ _id: user._id },
		// 	{ meetupProfile: meetupProfile }
		// )
    }
}

const getMember = (token) => {
	return new Promise((resolve, reject) => {
		request
			.get(URL.MEMBER)
			.set({'Authorization': `Bearer ${token}`})
			.end((err, res) => {
				if (err) { reject(err) }
				else { resolve(res.body) }
			})
	})
}

const getRole = (user) => {
	return new Promise((resolve, reject) => {
		// user.meetup.id = 184522987
		var url = URL.PROFILE + `/${PRISMGROUPID}/${user.meetup.id}?key=${PRISMAPIKEY}&sign=true`
		request
			.get(url)
			.end((err, res) => {
				// log(res.body, 'res.body')
				err ? reject(err) : resolve(res.body.role)
			})
	})
}

const promoteMember = (user) => {
	return new Promise((resolve, reject) => {
		// user.meetup.id = 184522987
		var url = `https://api.meetup.com/2/profile/${PRISMGROUPID}/${user.meetup.id}?add_role=event_organizer`
		request
			.post(url)
			.set({'Authorization': `Bearer ${administrator.access_token}`})
			.end((err, res) => {
				// log(res.body, 'res')
				err ? reject(err) : resolve(res.body)
			})
	})
}

async function postEvent (token, event) {

	// log(token,'token')

	var result = await rest({
		method: 'POST',
		headers: { 'Authorization': `Bearer ${token}` },
		path: URL.POSTEVENT,
		params: event
	})

	result = JSON.parse(result.entity)
	log(token, 'result')

	if (result.errors) {
		throw result.errors[0].message
	} else {
		return result
	}

}

async function removeEvent (token, eventId) {
	var result = await rest({
		method: 'DELETE',
		headers: { 'Authorization': `Bearer ${token}` },
		path: URL.DELETEEVENT + `/${eventId}`
	})

	log(result.entity, 'result.entity')
}

export default {
	ensureOrganizer,
	getMember,
	postEvent,
	removeEvent
}