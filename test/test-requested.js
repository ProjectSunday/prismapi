import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('Requested Classes -', () => {


		it('should create a requested class', done => {
			sendGraph(`
				mutation {
					createRequestedClass (name: "testrequestedclass") {
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
				TestData.CREATED_REQUEST_CLASS_ID = _id
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
					deleteRequestedClass(_id: "${TestData.CREATED_REQUEST_CLASS_ID}") {
						_id,
						status
					}
				}`
			)
			.end((err, res) => {
				// log(res.body)
				var { _id, status } = res.body.data.deleteRequestedClass
				expect(_id).to.equal(TestData.CREATED_REQUEST_CLASS_ID)
				expect(status).to.equal('DELETE_SUCCESS')
				done()
			})
		})


	})
}




