import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './schema-category'
import { RequestedClass } from '~/backend/backend'

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
			var requestedClass = new RequestedClass()
			await requestedClass.getAll()
			return requestedClass.data
		}
	}
}

const mutations = {

	createRequestedClass: {
		type: RequestedClassType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			category: { type: GraphQLID }
		},
		resolve: async (root, args) => {
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


