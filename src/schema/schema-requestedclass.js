import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './schema-category'
import { UserType } from './schema-user'
import { Context, RequestedClass, User } from '~/backend/backend'

const RequestedClassType = new GraphQLObjectType({
	name: 'RequestedClass',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: {
			type: CategoryType,
			resolve: async (requestedClass) => {
				var context = new Context()
				context.category._id = requestedClass.category
				var category = new Category(context)
				await category.fetch()
				return context.category
			}
		},
		date: { type: GraphQLString }, //this is wrong
		interested: { type: new GraphQLList(UserType) },
		location: { type: GraphQLString },

		status: { type: GraphQLString }
	})
})

const Queries = {
	requestedClasses: {
		type: new GraphQLList(RequestedClassType),
		resolve: async () => {
			var context = new Context()
			var requestedClass = new RequestedClass(context)
			await requestedClass.fetchAll()
			return context.requestedClasses
		}
	}
}

const Mutations = {

	createRequestedClass: {
		type: RequestedClassType,
		args: {
			token: { type: new GraphQLNonNull(GraphQLString) },
			name: { type: new GraphQLNonNull(GraphQLString) },
			category: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.requestedClass = {
				name: args.name,
				category: args.category,
				interested: []
			}
			context.user.token = args.token

			var requestedClass = new RequestedClass(context)
			await requestedClass.create()
			return context.requestedClass
		}
	},

	deleteRequestedClass: {
		type: RequestedClassType,
		args: {
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.requestedClass._id = args._id
			var requestedClass = new RequestedClass(context)
			await requestedClass.delete()
			return context.requestedClass
		}
	},

	addInterestedUser: {
		type: RequestedClassType,
		args: {
			token: { type: new GraphQLNonNull(GraphQLString) },
			requestedClassId: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.user.token = args.token
			var user = new User(context)
			await user.fetch()

			context.requestedClass._id = args.requestedClassId
			var requestedClass = new RequestedClass(context)
			await requestedClass.addInterestedUser()

			return context.requestedClass
		}
	},

	removeInterestedUser: {
		type: RequestedClassType,
		args: {
			token: { type: new GraphQLNonNull(GraphQLString) },
			requestedClassId: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.user.token = args.token
			var user = new User(context)
			await user.fetch()

			context.requestedClass._id = args.requestedClassId
			var requestedClass = new RequestedClass(context)
			await requestedClass.removeInterestedUser()

			return context.requestedClass

			// return {
			// 	_id: 'blah',
			// 	name: 'blah',
			// 	interested: []
			// }
		}
	},


}

export default { Queries, Mutations }


