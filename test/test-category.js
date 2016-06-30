import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('Category', () => {

		it('should return all categories', done => {
			sendGraph(`
				query {
					categories {
						_id
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				assert.isArray(res.body.data.categories)
				done()
			})
		})

		it('should create a category', done => {
			sendGraph(`
				mutation {
					createCategory (name: "testtesttest") {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				var { _id } = res.body.data.createCategory
				TestData.CATEGORY_ID_CREATED = _id
				expect(_id).to.exist
				done()
			})
		})

		it('should remove a category', done => {
			sendGraph(`
				mutation {
					deleteCategory(_id: "${TestData.CATEGORY_ID_CREATED}") {
						_id,
						status
					}
				}
			`)
			.end((err, res) => {
				var { status } = res.body.data.deleteCategory
				expect(status).to.equal('DELETE_SUCCESS')
				done()
			})
		})

	})
}

