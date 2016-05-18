import { MongoClient } from 'mongodb'

var PRISM_DB_CONNECTION_STRING = 'mongodb://localhost:27017/prism'

export default new Promise((resolve, reject) => {

    MongoClient.connect(PRISM_DB_CONNECTION_STRING).then(db => {
        console.log('=====> Connected to mongo server:', PRISM_DB_CONNECTION_STRING);
        resolve(db)
    }, error => {
        console.error('Unable to connect to mongo server.')
        console.error(error);
        reject()
    })

})