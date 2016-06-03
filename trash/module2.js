import { three } from './module3'

export const two = () => {
	return new Promise((resolve, reject) => {

		console.log('in 2')

		throw '2 error'

		resolve(three())

	})

}

