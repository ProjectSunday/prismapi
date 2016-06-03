
export const three = () => {
	return new Promise((resolve, reject) => {
		console.log('in 3')
		// resolve()
		// reject()

		throw "bad error"
		// resolve();

		resolve()

	})
}
