import { assert, expect } from 'chai'

import { sendGraph } from './test-server'
import TestData from './test-data'

export default () => {

	describe('Testing/Debugging/Fucking around', () => {

		it('do the thing', done => {
			sendGraph(`
				query {
					testing {
						result
					}
				}
			`)
			.end((err, res) => {
				log(res.body, 'body')
				done()
			})
		})

	})
}

