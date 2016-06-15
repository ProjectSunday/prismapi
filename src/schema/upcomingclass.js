import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import db from '~/data/db'
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
	log(user, 'user')
	await meetup.ensureOrganizer(user)

	var newEvent = {
		name: args.name
	}
	var event = await meetup.postEvent(user.token, newEvent)

	log(event, 'event')

	var newClass = {
		teacher: [ user._id ],
		meetupEvent: event
	}
	return await db.upcomingClass.mutate(newClass)
}

/////////////////////////////////////////////////////////////////////////////

export default { mutations }