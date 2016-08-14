var MongoClient =require('mongodb').MongoClient

var PRISM_DB_CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017/prism'

var categories = [
	{ key: 1,      name: 'Automotive', 		imageName: 'automotive' },
	{ key: 2,      name: 'Culinary', 		imageName: 'culinary' },
	{ key: 3,      name: 'DIY', 			imageName: 'diy' },
	{ key: 4,      name: 'Fitness', 		imageName: 'fitness' },
	{ key: 5,      name: 'Games', 			imageName: 'games' },
	{ key: 6,      name: 'History',    		imageName: 'history' },
	{ key: 7,      name: 'Language',    	imageName: 'language' },
	{ key: 8,      name: 'Literature',   	imageName: 'literature' },
	{ key: 9,      name: 'Music',			imageName: 'music' },
	{ key: 10,     name: 'Other',			imageName: 'other' },
	{ key: 11,     name: 'Performing Arts',	imageName: 'performingarts' },
	{ key: 12,     name: 'Science',    		imageName: 'science' },
	{ key: 13,     name: 'Sports',     		imageName: 'sports' },
	{ key: 14,     name: 'Technology', 		imageName: 'technology' },
	{ key: 15,     name: 'Visual Arts',    	imageName: 'visualarts' }
];


// var fakeMeetupProfile = {
//     birthday: { year: 1916 },
//     country: 'us',
//     city: 'Indianapolis',
//     topics: [],
//     joined: 1424205625000,
//     link: 'http://www.meetup.com/members/184522987',
//     photo: {
//         highres_link: 'http://photos1.meetupstatic.com/photos/member/2/9/0/2/highres_246670498.jpeg',
//         photo_id: 246670498,
//         photo_link: 'http://photos3.meetupstatic.com/photos/member/2/9/0/2/member_246670498.jpeg',
//         thumb_link: 'http://photos1.meetupstatic.com/photos/member/2/9/0/2/thumb_246670498.jpeg'
//     },
//     lon: -86.2699966430664,
//     other_services: {},
//     name: 'FAKE Local Learners Test User',
//     visited: 1464842110000,
//     self: { common: {} },
//     id: 1111,
//     state: 'IN',
//     lang: 'en_US',
//     lat: 39.84000015258789,
//     status: 'active'
// }


MongoClient.connect(PRISM_DB_CONNECTION_STRING).then(db => {

    // const insertFakeUser = () => {
    //     db.collection('users').insert({
    //         meetup: fakeMeetupProfile,
    //         token: 'testtoken'
    //     })
    // }


    var wipeAll = [
    	db.collection('categories').remove(),
    	db.collection('requestedclasses').remove(),
    ]

    Promise.all(wipeAll).then(() => {
        return db.collection('categories').insert(categories)
    }).then(inserted => {
    	console.log('inserted', inserted)
    	db.close()
    })

}, error => {
    console.error('Unable to connect to mongo server.')
    console.error(error);
})

