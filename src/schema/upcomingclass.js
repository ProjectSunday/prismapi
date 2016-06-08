import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import db from '~/data/db'
import meetup from '~/meetup/meetup'

import { UserType } from './user'

const UpcomingClassType = new GraphQLObjectType({
	name: 'UpcomingClassType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString }
	})
})

// const MeetupProfileType = new GraphQLObjectType({
// 	name: 'MeetupProfile',
// 	fields: () => ({
// 		id: { type: GraphQLInt },
// 		name: { type: GraphQLString },
// 		photo: { type: PhotoType }
// 	})
// })

// const UserType = new GraphQLObjectType({
// 	name: 'User',
// 	fields: () => ({
// 		_id: { type: GraphQLID },
// 		meetup: {
// 			type: MeetupProfileType,
// 			resolve: (user) => {
// 				return user.meetup
// 			}
// 		},
// 		token: { type: GraphQLString },
// 		status: { type: GraphQLString }
// 	})
// })

// /////////////////////////////////////////////////////////////////////////////

// const queries = {
// 	user: {
// 		type: UserType,
// 		args: {
// 			token: { type: GraphQLString }
// 		},
// 		resolve: (root, args) => {
// 			return users.read(args.token)
// 		}
// 	}
// }

/////////////////////////////////////////////////////////////////////////////

const mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			name: { type: GraphQLString }
		},
		resolve: createUpcomingClass
	}
}

async function createUpcomingClass(root, args) {

	var user = await db.user.read(args.token)

	// log(user)

	await meetup.ensureOrganizer(user)

	// var m = await meetup.getMember(args.token)
	// return await users.getFromMeetupProfile(m, args.token)
	return { _id: 'bah', name: 'testupcomingclass'}
}

/////////////////////////////////////////////////////////////////////////////

export default { mutations }