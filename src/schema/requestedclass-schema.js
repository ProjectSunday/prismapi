import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './schema-category'
import { UserType } from './schema-user'
import { NewContext, Context, RequestedClass, User } from '~/backend/backend'

const RequestedClassType = new GraphQLObjectType({
	name: 'RequestedClass',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: { type: CategoryType },
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
			categoryId: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()

			await context.user.read({ token: args.token })
			await context.category.read({ _id: args.categoryId })
			await context.requestedClass.create({ name: args.name })
			
			delete context.requestedClass.context

			return context.requestedClass
		}
	},

	deleteRequestedClass: {
		type: RequestedClassType,
		args: {
			//TODO: token to check to see if user is authorized to delete
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()

			await context.requestedClass.delete({ _id: args._id })

			var { _id, status } = context.requestedClass
			return { _id, status }
		}
	},

	addInterestedUser: {
		type: RequestedClassType,
		args: {
			token: { type: new GraphQLNonNull(GraphQLString) },
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()

			await context.user.read({ token: args.token })
			await context.requestedClass.addInterestedUser({ _id: args._id })

			return context.requestedClass
		}
	},

	removeInterestedUser: {
		type: RequestedClassType,
		args: {
			token: { type: new GraphQLNonNull(GraphQLString) },
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()

			await context.user.read({ token: args.token })
			await context.requestedClass.removeInterestedUser({ _id: args._id })

			return context.requestedClass
		}
	},


}

export default { Queries, Mutations }


