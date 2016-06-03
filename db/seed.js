var MongoClient =require('mongodb').MongoClient

var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'

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


var fakeMeetupProfile = {
    birthday: { year: 1916 },
    country: 'us',
    city: 'Indianapolis',
    topics: [],
    joined: 1424205625000,
    link: 'http://www.meetup.com/members/184522987',
    photo: {
        highres_link: 'http://photos1.meetupstatic.com/photos/member/2/9/0/2/highres_246670498.jpeg',
        photo_id: 246670498,
        photo_link: 'http://photos3.meetupstatic.com/photos/member/2/9/0/2/member_246670498.jpeg',
        thumb_link: 'http://photos1.meetupstatic.com/photos/member/2/9/0/2/thumb_246670498.jpeg'
    },
    lon: -86.2699966430664,
    other_services: {},
    name: 'FAKE Local Learners Test User',
    visited: 1464842110000,
    self: { common: {} },
    id: 1111,
    state: 'IN',
    lang: 'en_US',
    lat: 39.84000015258789,
    status: 'active'
}


MongoClient.connect(PRISM_DB_CONNECTION_STRING).then(db => {

    const insertFakeUser = () => {
        db.collection('users').insert({
            meetup: fakeMeetupProfile,
            token: 'testtoken'
        })
    }


    var wipeAll = [
    	db.collection('categories').remove(),
    	db.collection('requestedclasses').remove(),
        db.collection('users').remove()
    ]

    Promise.all(wipeAll).then(() => {
        insertFakeUser()
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

