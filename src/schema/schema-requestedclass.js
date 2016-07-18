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
			resolve: (requestedClass) => {
				return db.category.read(requestedClass.category)
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
			await requestedClass.getAll()
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
			}
			context.category._id = args.category
			context.user.token = args.token
			var requestedClass = new RequestedClass()

			await requestedClass.create({ name: args.name, category: args.category })
			return requestedClass.data
		}
	},

	deleteRequestedClass: {
		type: RequestedClassType,
		args: {
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var requestedClass = new RequestedClass()
			await requestedClass.delete(args._id)
			return requestedClass.data
		}
	}

}

export default { queries, mutations }


