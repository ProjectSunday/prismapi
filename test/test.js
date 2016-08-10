import supertest from 'supertest'

import '../debug'

import { TestServer } from './test-server'
import { getCategoryByName, getTestUser, getLocalLearnersTestUser } from './mocks'

import User from './user-test'

import Category from './test-category'
import Requested from './test-requested'
import Upcoming from './upcoming-test'

import Testing from './test-testing'


describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		global.LOCAL_LEARNERS_TEST_USER = await getLocalLearnersTestUser()
		global.CATEGORY_TECHNOLOGY = await getCategoryByName('Technology')
		done()
	})

	// Testing()

	User()

	// Category()
	
	// Requested()

	Upcoming()


	after(async (done) => {
		await TestServer.stop()
		done()
	})
})


