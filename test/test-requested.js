import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

var REQUESTED_CLASS_ID_TO_DELETE

export default () => {

	describe('Requested Classes -', () => {


		it('should create a requested class', done => {
			sendGraph(`
				mutation {
					createRequestedClass ( token: "${TestData.LOCAL_LEARNER_TEST_USER_TOKEN}", name: "testrequestedclass", category: "${TestData.TEST_CATEGORY_ID}" ) {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { _id, name } = res.body.data.createRequestedClass
				assert(_id !== undefined, '_id is undefined')
				assert(name === 'testrequestedclass', 'name is not correct')
				REQUESTED_CLASS_ID_TO_DELETE = _id
				done()
			})
		})


		it('should return all requested classes', done => {
			sendGraph(`
				query {
					requestedClasses {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { requestedClasses } = res.body.data
				assert(Array.isArray(requestedClasses), 'requestedClasses is not an array')
				assert(requestedClasses.length > 0, 'requestedClasses is empty')
				done()
			})
		})


		it('should delete a requested class', done => {
			sendGraph(`
				mutation {
					deleteRequestedClass(_id: "${REQUESTED_CLASS_ID_TO_DELETE}") {
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




