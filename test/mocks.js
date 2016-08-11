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

export const getCategoryByName = async (name) => {
	var category = new Category()
	await category.fetch({ name })
	return category
}

