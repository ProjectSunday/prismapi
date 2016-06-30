import { assert, expect } from 'chai'

import { sendGraph } from './test-server'

var CREATED_REQUEST_CLASS_ID

export default () => {

	describe('Requested Classes', () => {

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
				assert.isArray(res.body.data.requestedClasses)
				done()
			})
		})

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
				expect(_id).to.exist
				expect(name).to.equal('testrequestedclass')
				CREATED_REQUEST_CLASS_ID = _id
				done()
			})
		})

		it('should delete a requested class', done => {
			sendGraph(`
				mutation {
					deleteRequestedClass(_id: "${CREATED_REQUEST_CLASS_ID}") {
						_id,
						status
					}
				}`
			)
			.end((err, res) => {
				// log(res.body)
				var { _id, status } = res.body.data.deleteRequestedClass
				expect(_id).to.equal(CREATED_REQUEST_CLASS_ID)
				expect(status).to.equal('DELETE_SUCCESS')
				done()
			})
		})


	})
}




