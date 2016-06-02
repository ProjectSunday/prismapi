import request from 'superagent'

const URL = {
	MEMBER: 'https://api.meetup.com/2/member/self'
}

export const getMember = (token) => {
	return new Promise((resolve, reject) => {
		request
			.get(URL.MEMBER)
			.set({'Authorization': `Bearer ${token}`})
			.end((err, res) => {
				if (err) { reject(err) }
				else { resolve(res.body) }
			})
	})

	// return { _id: 'testuseri'}
}