var _data = {
	categories: [
		{ id: 1, name: 'cat1', imageName: 'imageName1' },
		{ id: 2, name: 'cat2', imageName: 'imageName2' },
		{ id: 3, name: 'cat3', imageName: 'imageName3' }
	]
}


export default {
	read: () => {
		return _data
	},
	write: (data) => {
		Object.assign(_data.categories, data.categories)
		console.log('_dasdfsdfsdfsdfdsfta', _data)
	}
}