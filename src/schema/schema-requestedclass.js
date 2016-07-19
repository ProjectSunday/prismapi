import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './schema-category'
import { Context, RequestedClass } from '~/backend/backend'

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
		location: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

const queries = {
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

const mutations = {

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
				category: args.category
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
	}

}

export default { queries, mutations }


