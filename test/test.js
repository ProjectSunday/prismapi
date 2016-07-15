import supertest from 'supertest'

import '../debug'

import { TestServer } from './test-server'

import User from './test-user'

import Category from './test-category'
import Requested from './test-requested'
import Upcoming from './test-upcoming'

import Testing from './test-testing'


describe('Prism API Mocha Testing', () => {

	before(async (done) => {
		await TestServer.start()
		done()
	})

	// Testing()

	User()

	// Category()
	// Requested()
	// Upcoming()


	after(async (done) => {
		await TestServer.stop()
		done()
	})
})


