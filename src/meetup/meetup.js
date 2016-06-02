import request from 'superagent'

export const getMember = (token) => {

	var url = 'https://api.meetup.com/2/member/self'
	request
		.get(url)
		.set({'Authorization': `Bearer ${token}`})
		.end((err, res) => {
			console.log('err', err);
			console.log('res', res.body);
		})

	return { _id: 'testuseri'}
}