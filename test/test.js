import supertest from 'supertest'

import '../debug'

import { TestServer } from './test-server'
import { getCategoryByName, getTestUser } from './test-data'

import User from './test-user'

import Category from './test-category'
import Requested from './test-requested'
import Upcoming from './test-upcoming'

import Testing from './test-testing'


describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		global.TEST_USER = await getTestUser()
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


