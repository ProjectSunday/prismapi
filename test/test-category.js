import { assert } from 'chai'

import { sendQuery } from './test-server'
// import TestData from './test-data'

// var CATEGORY_ID_TO_DELETE

export default () => {

	describe('Category -', () => {

		it('should return all categories', done => {
			sendQuery(`
				categories {
					_id,
					name
				}
			`, data => {
				var { categories } = data
				assert(Array.isArray(categories), 'categories should be an array')
				assert(categories.length, 'categories should not be empty')

				done()
			})
		})

		// it('should return all categories', (done) => {
		// 	sendQuery(`
		// 		categories {
		// 			_id,
		// 			name
		// 		}
		// 	`, data => {
		// 		console.log('data', data)
		// 		// done()
		// 	})
		// })

		// it('should create a category', done => {
		// 	sendGraph(`
		// 		mutation {
		// 			createCategory (name: "testtesttest") {
		// 				_id,
		// 				name
		// 			}
		// 		}
		// 	`)
		// 	.end((err, res) => {
		// 		// log(res.body)
		// 		var { name, _id } = res.body.data.createCategory
		// 		assert(name === 'testtesttest', 'name is not testtesttest')
		// 		assert(_id !== undefined, '_id is undefined')
		// 		CATEGORY_ID_TO_DELETE = _id
		// 		done()
		// 	})
		// })

		// it('should delete a category', done => {
		// 	sendGraph(`
		// 		mutation {
		// 			deleteCategory(_id: "${CATEGORY_ID_TO_DELETE}") {
		// 				status
		// 			}
		// 		}
		// 	`)
		// 	.end((err, res) => {
		// 		// log(res.body)
		// 		var { status } = res.body.data.deleteCategory
		// 		assert(status === 'DELETE_SUCCESS', 'status not DELETE_SUCCESS')
		// 		done()
		// 	})
		// })

	})
}

