import { two } from './module2'

// export const one = () => {
// 	return new Promise((resolve, reject) => {
// 		console.log('in 1')
// 		resolve()

// 		return 
// 	})
// }

console.log('in 1')

two().then(r => {
	console.log('in 1 success')
}).catch(e => {
	console.log('in 1 error:', e)
})