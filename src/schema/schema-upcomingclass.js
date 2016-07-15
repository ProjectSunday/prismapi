import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { UserType } 				from './schema-user'
import { Context, UpcomingClass } 	from '~/backend/backend'

/////////////////////////////////////////////////////////////////////////////

const UpcomingClassType = new GraphQLObjectType({
	name: 'UpcomingClassType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		event: {
			type: MeetupEventType,
			resolve: (upcomingClass) => upcomingClass.event
		},
		status: { type: GraphQLString }
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

const Queries = {
	upcomingClass: {
		type: UpcomingClassType,
		args: {
			_id: { type: GraphQLID }
		},
		resolve: async (root, args) => {
			var upcoming = new UpcomingClass()
			upcoming.data = {
				_id: args._id
			}
			await upcoming.fetch()
			return upcoming.data
		}
	},
	upcomingClasses: {
		type: new GraphQLList(UpcomingClassType),
		resolve: async (root, args) => {
			var upcoming = new UpcomingClass()
			await upcoming.getAll()
			return upcoming.data
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

const Mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.user.token = args.token
			context.upcomingClass.event = {
				name: args.name
			}
			await new UpcomingClass(context).create()
			return context.upcomingClass
		}
	},
	deleteUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			_id: { type: GraphQLID }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.user.token = args.token
			context.upcomingClass._id = args._id
			await new UpcomingClass(context).delete()
			return context.upcomingClass
		}
	}

}

/////////////////////////////////////////////////////////////////////////////

export default { Mutations, Queries }