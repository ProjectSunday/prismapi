import { assert } from 'chai'

import { sendQuery, sendMutation } from './test-server'

var UPCOMING_CLASS_ID

export default () => {

	describe('Upcoming Classes -', () => {

		it('should create an upcoming class', done => {
			var name = `testupcomingclass ${new Date().toString()}`
			sendMutation(`
				createUpcomingClass (token: "${LOCAL_LEARNERS_TEST_USER.token}", categoryId: "${CATEGORY_TECHNOLOGY._id}", name: "${name}") {
					_id,
					category {
						_id,
						name
					},
					event {
						id,
						name
					},
					teachers {
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
				var { createUpcomingClass } = data
				assert(createUpcomingClass, 'createUpcomingClass should have data')

				var { _id, category, event, teachers } = createUpcomingClass
				assert(_id !== undefined, '_id should be defined')
				UPCOMING_CLASS_ID = _id
				assert(category, 'category should have data')
				assert(event, 'event should have data')
				assert(teachers[0], 'first teacher in teachers array should exist')

				var { _id, name } = category
				assert(_id.toString() === CATEGORY_TECHNOLOGY._id.toString(), '_id should be ' + CATEGORY_TECHNOLOGY._id)
				assert(name === CATEGORY_TECHNOLOGY.name, 'category name should be ' + CATEGORY_TECHNOLOGY.name)

				done()
			})
		})

		it('should retrieve all upcoming classes', done => {
			sendQuery(`
				upcomingClasses {
					_id
				}
			`, data => {
				var { upcomingClasses } = data
				assert(upcomingClasses, 'upcomingClasses should contain data')
				assert(upcomingClasses[0], 'first class should contain data')
				assert(upcomingClasses[0]._id !== undefined, '_id of first class should be defined')

				done()
			})
		})

		it('should retrieve an upcoming class', done => {
			sendQuery(`
				upcomingClass ( _id: "${UPCOMING_CLASS_ID}") {
					_id,
					category {
						_id
					},
					event {
						id
					},
					teachers {
						_id
					}
				}
			`, data => {
				var { upcomingClass } = data
				assert(upcomingClass, 'upcomingClass should contain data')

				var { category, event, teachers } = upcomingClass
				assert(category._id !== undefined, "category _id should exist")
				assert(event.id !== undefined, "event id should exist")
				assert(teachers[0]._id !== undefined, "first teacher _id should exist")

				done()
			})
		})

		// it('should delete an upcoming class and its event', done => {
		// 	sendMutation(`
		// 		deleteUpcomingClass ( token: "${LOCAL_LEARNERS_TEST_USER.token}", _id: "${UPCOMING_CLASS_ID}") {
		// 			_id,
		// 			status
		// 		}
		// 	`, data => {
		// 		var { deleteUpcomingClass } = data
		// 		assert(deleteUpcomingClass, 'deleteUpcomingClass should have data')

		// 		var { _id, status } = deleteUpcomingClass
		// 		assert(_id === UPCOMING_CLASS_ID, '_id should be ' + UPCOMING_CLASS_ID)
		// 		assert(status === 'DELETE_SUCCESS', 'status should BE DELETE_SUCCESS')

		// 		done()
		// 	})
		// })


	})
}

