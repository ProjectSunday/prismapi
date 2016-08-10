import { assert, expect } from 'chai'

import { sendGraph } from './test-server'

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

