import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { UserType } 		from './schema-user'
import { CategoryType } 	from './schema-category'
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
			await context.user.ensureOrganizer()  //broken

			await context.category.fetch({ _id: args.categoryId })

			await context.upcomingClass.create2({ name: args.name })


			var upcomingClass = Object.assign({}, context.upcomingClass)
			delete upcomingClass.context

			console.log(upcomingClass, 'upcomingClass')

			return upcomingClass

			// await context.upcomingClass.create({
			// 	name: args.name
			// })

			// var blah = context.upcomingClass.toJSON()




			// console.log('blah', blah)

			// context.upcomingClass.event = {
			// 	name: args.name
			// }
			// await new UpcomingClass(context).create()
			// return context.upcomingClass
			// return { blah: 'blah'}
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