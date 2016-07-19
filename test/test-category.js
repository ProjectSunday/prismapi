import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

var CATEGORY_ID_TO_DELETE

export default () => {

	describe('Category -', () => {

		it('should return all categories', done => {
			sendGraph(`
				query {
					categories {
						_id,
						name
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { categories } = res.body.data
				assert(Array.isArray(res.body.data.categories), 'categories not an array')
				assert(categories.length, 'categories array empty')
				TestData.TEST_CATEGORY_ID = categories[0]._id
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
				// log(res.body)
				var { name, _id } = res.body.data.createCategory
				assert(name === 'testtesttest', 'name is not testtesttest')
				assert(_id !== undefined, '_id is undefined')
				CATEGORY_ID_TO_DELETE = _id
				done()
			})
		})

		it('should delete a category', done => {
			sendGraph(`
				mutation {
					deleteCategory(_id: "${CATEGORY_ID_TO_DELETE}") {
						status
					}
				}
			`)
			.end((err, res) => {
				// log(res.body)
				var { status } = res.body.data.deleteCategory
				assert(status === 'DELETE_SUCCESS', 'status not DELETE_SUCCESS')
				done()
			})
		})

	})
}

