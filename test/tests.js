import supertest from 'supertest'

import '../debug'

import { TestServer } from './test-server'
import { getCategoryByName, getTestUserAlpha, createTestUserBeta, deleteTestUserBeta, getLocalLearnersTestUser } from './mocks'

import User 		from './user-tests'
import Category 	from './category-tests'
import Requested 	from './requested-tests'
import Upcoming 	from './upcoming-tests'

import Testing from './test-testing'


describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		global.LOCAL_LEARNERS_TEST_USER = await getLocalLearnersTestUser()
		global.TEST_USER_ALPHA = await getTestUserAlpha()
		global.TEST_USER_BETA = await createTestUserBeta()
		global.CATEGORY_TECHNOLOGY = await getCategoryByName('Technology')
		done()
	})

	// Testing()

	User()

	// Category()
	
	// Requested()

	Upcoming()


	after(async (done) => {
		await deleteTestUserBeta({ _id: TEST_USER_BETA._id })
		await TestServer.stop()
		done()
	})
})


