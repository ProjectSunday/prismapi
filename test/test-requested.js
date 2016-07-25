import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

var TEST_CREATED_REQUESTED_CLASS_ID

export default () => {

	describe('Requested Classes -', () => {


		it('should create a requested class', done => {
			sendGraph(`
				mutation {
					createRequestedClass ( token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", name: "testrequestedclass", categoryId: "${TestData.TEST_CATEGORY_ID}" ) {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				log(res.body)
				var { _id, name } = res.body.data.createRequestedClass
				assert(_id !== undefined, '_id is undefined')
				assert(name === 'testrequestedclass', 'name is not correct')
				TEST_CREATED_REQUESTED_CLASS_ID = _id
				done()
			})
		})


		it('should return all requested classes', done => {
			sendGraph(`
				query {
					requestedClasses {
						_id,
						name,
						category {
							_id,
							name
						}
					}
				}
			`)
			.end((err, res) => {
				log(res.body)
				var { requestedClasses } = res.body.data
				assert(Array.isArray(requestedClasses), 'requestedClasses is not an array')
				assert(requestedClasses.length > 0, 'requestedClasses is empty')

				var { category } = requestedClasses[0]

				log(category, 'category')


				done()
			})
		})

		it('should add an interested user to a requested class', done => {
			sendGraph(`
				mutation {
					addInterestedUser ( token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", requestedClassId: "${TEST_CREATED_REQUESTED_CLASS_ID}" ) {
						_id,
						name,
						interested {
							_id,
							meetupMember {
								id,
								name
							}
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, name, interested } = res.body.data.addInterestedUser

				assert(_id !== undefined, '_id undefined')
				assert(name !== undefined, 'class name undefined')
				assert(Array.isArray(interested), 'interested list is not an array')
				assert(interested.length, 'interested list is empty')

				// log(interested[0], 'interested0')
				var { _id, meetupMember } = interested[0]
				assert(_id !== null, 'user _id null')
				assert(meetupMember !== undefined, 'user meetup profile undefined')
				assert(meetupMember.name === 'Local Learners Test User', 'meetup name not local learners test user')

				done()
			})
		})


		it('should remove an interested user to a requested class', done => {
			sendGraph(`
				mutation {
					removeInterestedUser ( token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", requestedClassId: "${TEST_CREATED_REQUESTED_CLASS_ID}" ) {
						_id,
						name,
						interested {
							_id,
							meetupMember {
								id,
								name
							}
						}
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, name, interested } = res.body.data.removeInterestedUser

				assert(_id !== undefined, '_id should be defined')
				assert(name !== undefined, 'class name should be defined')
				assert(Array.isArray(interested), 'interested list should be an array')
				assert(interested.length === 0, 'interested list should be empty')


				done()
			})
		})




		it('should delete a requested class', done => {
			sendGraph(`
				mutation {
					deleteRequestedClass(_id: "${TEST_CREATED_REQUESTED_CLASS_ID}") {
						status
					}
				}`
			)
			.end((err, res) => {
				// log(res.body)
				var { status } = res.body.data.deleteRequestedClass
				assert(status === 'DELETE_SUCCESS', 'status not DELETE_SUCCESS')
				done()
			})
		})


	})
}




