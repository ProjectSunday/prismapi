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

    var wipeAll = [
    	db.collection('categories').remove(),
    	db.collection('requestedclasses').remove()
    ]

    Promise.all(wipeAll).then(() => {
		return db.collection('categories').insert(categories)
    }).then(result => {
    	console.log('result', result)
    	var categories = result.ops
    	var requestedClasses = []
   		categories.forEach(c => {
   			requestedClasses.push({ name: c.name + ' Class A', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class BB', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class npmCCC', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class DDDD', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class EEEEE', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class FFFFF F', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
   			requestedClasses.push({ name: c.name + ' Class GGGGG GG', category: c._id, date: 'January 22, 1997', location: 'requestedlocation'})
    	})
    	return db.collection('requestedclasses').insert(requestedClasses)
    }).then(inserted => {
    	console.log('inserted', inserted)
    	db.close()
    })
}, error => {
    console.error('Unable to connect to mongo server.')
    console.error(error);
})
	// })
// }
