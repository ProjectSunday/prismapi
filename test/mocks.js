import { Category, Context, User } from '~/backend/backend'

export const getLocalLearnersTestUser = async () => {
	var user = new User()
	await user._createFromMeetup({
		email: 'locallearnersuser@gmail.com',
		password: 'thirstyscholar1'
	})
	delete user.context
	// console.log('user _createFromMeetup: ', user)
	return user
}

export const getTestUserAlpha = async () => {
	var testUserAlpha = {
		token: 'TEST_USER_ALPHA.token',
		meetup: {
			token: 'TEST_USER_ALPHA.meetup.token',
			member: {
				id: 1234,
				name: 'TEST_USER_ALPHA.name'
			}
		}
	}

	var user = new User()

	try {
		await user.read({ token: 'TEST_USER_ALPHA.token' })
		return user
	} catch (er) {
		await user.create(testUserAlpha)
		return user
	}
}

export const createTestUserBeta = async () => {
	var testUserBeta = {
		token: 'TEST_USER_BETA.token',
		meetup: {
			token: 'TEST_USER_BETA.meetup.token',
			member: {
				id: 1234,
				name: 'TEST_USER_BETA.name'
			}
		}
	}

	var user = new User()
	await user.upsert({ token: 'TEST_USER_BETA.token'}, testUserBeta)
	delete user.context
	return user
}

export const deleteTestUserBeta = async (filter) => {
	var user = new User()
	await user.delete(filter)
}



export const getCategoryByName = async (name) => {
	var category = new Category()
	await category.fetch({ name })
	return category
}

