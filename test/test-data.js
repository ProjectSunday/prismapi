import { Context, User } from '~/backend/backend'

// export default {
// 	LOCAL_LEARNER_TEST_USER_TOKEN: '',
// 	TEST_CATEGORY_ID: undefined,
// 	TEST_UPCOMING_CLASS_ID: '',
// 	CREATED_REQUEST_CLASS_ID: undefined
// }

// export const createCategory = async () => {
// 	var category = await sendGraph(`
// 		mutation {
// 			createCategory (name: "testtesttest") {
// 				_id
// 			}
// 		}
// 	`)

// 	return category._id

// 	.end((err, res) => {
// 		var { _id } = res.body.data.createCategory
// 		TEST_CATEGORY_ID = _id
// 		done()
// 	})

// }

// var _TEST_DATA = {
// 	TEST_USER: undefined
// }

export const getTestUser = async () => {
	var user = new User()
	await user.createFromMeetup({
		email: 'locallearnersuser@gmail.com',
		password: 'thirstyscholar1'
	})
	return user.toJSON()
}

// var TEST_USER

// export const init = async () => {
// 	var user = new User()
// 	await user.createFromMeetup({
// 		email: 'locallearnersuser@gmail.com',
// 		password: 'thirstyscholar1'
// 	})
// 	TEST_USER = user.toJSON()
// }


// var _testUser

// export const TEST_USER = async () => {
// 	if (_testUser)
// 	var user = new User()
// 	await user.createFromMeetup({
// 		email: 'locallearnersuser@gmail.com',
// 		password: 'thirstyscholar1'
// 	})
// 	_TEST_DATA.TEST_USER = user.toJSON()
// }

// export default {
// 	init,
// 	TEST_USER
// }