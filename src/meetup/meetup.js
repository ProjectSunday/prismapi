import request from 'superagent'

import administrator from './administrator'

const PRISMGROUPID = 18049722
const PRISMGROUPNAME = 'locallearners'

const PRISMAPIKEY = '7d156b614b6d5c5e7d357e18151568'

const URL = {
	MEMBER: 'https://api.meetup.com/2/member/self',
	MEMBERS: 'https://api.meetup.com/LocalLearners/members/',
    PROFILE: 'https://api.meetup.com/2/profile',
    TEST: 'https://api.meetup.com/2/events'
}

const ensureOrganizer = async (user) => {
		var role = await getRole(user)
		log(role, 'role')

        if (role !== 'Event Organizer' || role !== 'Organizer') {
        	await promoteMember(user)
        }


		return 'blah'

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
		user.meetup.id = 184522987
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
		var userid = 184522987
		// var url = URL.PROFILE + `/${PRISMGROUPID}/${userid}`
		// var url = URL.MEMBERS + `184522987?key=${PRISMAPIKEY}&sign=true`
		// var url = URL.MEMBERS + `184522987`
		// request
		// 	.post(url)
  //           .set({'Content-Type': 'application/json'})
		// 	.send({ add_role: 'event_organizer' })
		// 	.end((err, res) => {
		// 		console.log(err)
		// 		log(res.body, 'res')
		// 		err ? reject(err) : resolve(res.body)
		// 	})

		// var url = URL.TEST + `?group_urlname=locallearners&key=${PRISMAPIKEY}&sign=true`
		// var url = 'https://api.meetup.com/2/events?offset=0&format=json&limited_events=False&group_urlname=locallearners&page=200&fields=&order=time&desc=false&status=upcoming&sig_id=182509367&sig=df92266de442038f0c72e0c5bb6c46f59de61184'
		// var url = `https://api.meetup.com/locallearners/members/self?key=${PRISMAPIKEY}sign=true`
		var url = `https://api.meetup.com/locallearners/members/${userid}`
		log(url,'post url')

		request
			.patch(url)
			.set({'Authorization': `Bearer e42da34eb467af35747e349c81b75519`})
            // .set({'Content-Type': 'application/json'})
            // .set({'X-OAuth-Scopes': 'basic'})
			.send({ add_role: 'event_organizer' })
			// .set({'X-OAuth-Scopes': 'profile_edit'})
			.set('X-OAuth-Scopes', 'basic, profile_edit')
			.set('X-Accepted-OAuth-Scopes', 'basic, profile_edit')
			// .set({'X-Accepted-OAuth-Scopes': 'profile_edit'})
			// .set({'X-API-Key': `${PRISMAPIKEY}`})
			// .set({'Accept': 'application/json'})
			.end((err, res) => {
				console.log(err)
				// console.log(res)
				log(res.body, 'res')
				err ? reject(err) : resolve(res.body)
			})



	})
}

export default {
	ensureOrganizer,
	getMember
}