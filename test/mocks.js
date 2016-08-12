import { Category, Context, User } from '~/backend/backend'

export const getLocalLearnersTestUser = async () => {
	var user = new User()
	await user.createFromMeetup({
		email: 'locallearnersuser@gmail.com',
		password: 'thirstyscholar1'
	})
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

	try {
		await user.read({ token: 'TEST_USER_BETA.token' })
		return user
	} catch (er) {
		await user.create(testUserBeta)
		return user
	}
}

export const deleteTestUserBeta = async () => {
	await user.delete({ token: 'TEST_USER_BETA.token' })
}



export const getCategoryByName = async (name) => {
	var category = new Category()
	await category.fetch({ name })
	return category
}

