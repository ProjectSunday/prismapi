import { assert } from 'chai'

import { sendQuery, sendMutation } from './test-server'

var REQUESTED_CLASS_ID

export default () => {

	describe('Requested Classes -', () => {

		it('should create a requested class', done => {
			sendMutation(`
				createRequestedClass ( 
					token: "${LOCAL_LEARNERS_TEST_USER.token}", 
					name: "testrequestedclass",
					categoryId: "${CATEGORY_TECHNOLOGY._id}" 
				) {
					_id,
					name,
					category {
						_id,
						name,
						imageName
					}
				}
			`, data => {
				var { createRequestedClass } = data
				assert(createRequestedClass, 'createRequestedClass should contain data')

				var { _id, name, category } = createRequestedClass
				assert(_id !== undefined, '_id should be defined')
				REQUESTED_CLASS_ID = _id
				assert(name === 'testrequestedclass', 'name should be testrequestedclass')
				assert(category, 'category should have data')

				var { _id, name, imageName } = category
				assert(_id !== undefined, '_id should exist')
				assert(name === CATEGORY_TECHNOLOGY.name, 'name should be ' + CATEGORY_TECHNOLOGY.name)
				assert(imageName === CATEGORY_TECHNOLOGY.imageName, 'name should be ' + CATEGORY_TECHNOLOGY.imageName)

				done()
			})
		})

		it('should return all requested classes', done => {
			sendQuery(`
				requestedClasses {
					_id,
				}
			`, data => {
				var { requestedClasses } = data
				assert(requestedClasses, 'requestedClasses should exist')
				assert(requestedClasses[0]._id, 'first requestedClasses _id should exist')

				done()
			})
		})

		it('should add an interested user', done => {
			sendMutation(`
				addInterestedUser ( token: "${TEST_USER_ALPHA.token}", _id: "${REQUESTED_CLASS_ID}" ) {
					_id,
					name,
					interested {
						_id,
						meetup {
							member {
								name
							}
						}
					}
				}
			`, data => {
				var { addInterestedUser } = data
				assert(addInterestedUser, 'addInterestedUser should contain data')

				var { _id, name, interested } = addInterestedUser
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(name === 'testrequestedclass', 'class name should be testrequestedclass')
				assert(Array.isArray(interested), 'interested list should be array')
				assert(interested.length === 2, 'there should be two people interested now')

				done()
			})
		})

		it('should remove an interested user to a requested class', done => {
			sendMutation(`
				removeInterestedUser ( token: "${TEST_USER_ALPHA.token}", _id: "${REQUESTED_CLASS_ID}" ) {
					_id,
					name,
					interested {
						_id,
						meetup {
							member {
								id,
								name
							}
						}
					}
				}
			`, data => {
				var { removeInterestedUser } = data
				assert(removeInterestedUser, 'removeInterestedUser should contain data')

				var { _id, name, interested } = removeInterestedUser
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(name === 'testrequestedclass', 'class name should be testrequestedclass')
				assert(Array.isArray(interested), 'interested list should be an array')
				assert(interested.length === 1, 'interested list should be just one person')

				done()
			})
		})


		it('should delete a requested class', done => {
			sendMutation(`
				deleteRequestedClass(_id: "${REQUESTED_CLASS_ID}") {
					_id,
					status
				}
			`, data => {
				var { deleteRequestedClass } = data
				assert(deleteRequestedClass, 'deleteRequestedClass should contain data')

				var { _id, status } = deleteRequestedClass
				assert(_id === REQUESTED_CLASS_ID, '_id should be ' + REQUESTED_CLASS_ID)
				assert(status === 'DELETE_SUCCESS', 'status should be DELETE_SUCCESS')
				done()
			})
		})


	})
}




