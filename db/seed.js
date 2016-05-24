var MongoClient =require('mongodb').MongoClient

var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'


// export const categories = () => {
// 	return _db.collection('categories')
// }

// export const requestedClasses = () => {
// 	return _db.collection('requestedclasses')
// }

var categories = [
	{ name: 'Automotive', 		imageName: 'automotive' },
	{ name: 'Culinary', 		imageName: 'culinary' },
	{ name: 'DIY', 				imageName: 'diy' },		
	{ name: 'Fitness', 			imageName: 'fitness' },
	{ name: 'Games', 			imageName: 'games' },  
	{ name: 'History',    		imageName: 'history' },
	{ name: 'Language',    		imageName: 'language' },
	{ name: 'Literature',   	imageName: 'literature' },
	{ name: 'Music',			imageName: 'music' },
	{ name: 'Other',			imageName: 'other' },
	{ name: 'Performing Arts',	imageName: 'performingarts' },
	{ name: 'Science',    		imageName: 'science' },
	{ name: 'Sports',     		imageName: 'sports' },
	{ name: 'Technology', 		imageName: 'technology' },
	{ name: 'Visual Arts',    	imageName: 'visualarts' }
];



// export const connect = () => {
// 	return new Promise((resolve, reject) => {
MongoClient.connect(PRISM_DB_CONNECTION_STRING).then(db => {
    console.log('=====> Connected to mongo server:', PRISM_DB_CONNECTION_STRING);
    db.collection('categories').remove().then(function () {
		db.collection('categories').insert(categories)
    	db.close()
    })
}, error => {
    console.error('Unable to connect to mongo server.')
    console.error(error);
})
	// })
// }
