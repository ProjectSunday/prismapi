import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { UserType } 		from './user-schema'
import { CategoryType } 	from './category-schema'
import { MeetupType, EventType }		from './meetup-type'

import { Category, Context, UpcomingClass, User } from '~/backend/backend'


/////////////////////////////////////////////////////////////////////////////

const UpcomingClassType = new GraphQLObjectType({
	name: 'UpcomingClassType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: { type: CategoryType },
		event: { type: EventType },
		teachers: { type: new GraphQLList(UserType) },
		status: { type: GraphQLString }
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
			var context = new Context()
			context.upcomingClass._id = args._id
			var upcoming = new UpcomingClass(context)
			await upcoming.fetch()
			return context.upcomingClass
		}
	},
	upcomingClasses: {
		type: new GraphQLList(UpcomingClassType),
		resolve: async (root, args) => {
			var context = new Context()
			var upcoming = new UpcomingClass(context)
			await upcoming.getAll()
			return context.upcomingClasses
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

const Mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			categoryId: { type: GraphQLID },
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var context = new Context()

			await context.user.fetch({ token: args.token })
			await context.user.ensureOrganizer()

			await context.category.fetch({ _id: args.categoryId })

			await context.upcomingClass.create2({ name: args.name })

			var upcomingClass = Object.assign({}, context.upcomingClass)
			delete upcomingClass.context

			return upcomingClass
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
			
			await context.user.read({ token: args.token })
			await context.upcomingClass.delete({ _id: args._id })

			var { _id, status } = context.upcomingClass

			return { _id, status }
		}
	}

}

/////////////////////////////////////////////////////////////////////////////

export default { Mutations, Queries }