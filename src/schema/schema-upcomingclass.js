import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { UpcomingClass } 	from '~/backend/backend'

import { UserType } from './schema-user'

/////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////

//queries

/////////////////////////////////////////////////////////////////////////////

const Mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var upcoming = new UpcomingClass(args.token)
			upcoming.data = {
				event: {
					name: args.name
				}
			}
			await upcoming.create()
			return upcoming.data
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

export default { Mutations }