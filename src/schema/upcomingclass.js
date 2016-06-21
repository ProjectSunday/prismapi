import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { UpcomingClass, default as db } from '~/data/db'
import meetup from '~/meetup/meetup'

import { UserType } from './user'

const UpcomingClassType = new GraphQLObjectType({
	name: 'UpcomingClassType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		meetupEvent: {
			type: MeetupEventType,
			resolve: (upcomingClass) => upcomingClass.meetupEvent
		}
	})
})

const MeetupEventType = new GraphQLObjectType({
	name: 'MeetupEventType',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString }
	})
})

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

const Mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var upcoming = new UpcomingClass()
			return await upcoming.create(args.token, { name: args.name })
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

export default { Mutations }