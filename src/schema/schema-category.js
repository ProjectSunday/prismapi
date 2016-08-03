import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { Category, Context } from '~/backend/backend'

export const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

const queries = {
	categories: {
		type: new GraphQLList(CategoryType),
		resolve: async () => {
			var context = new Context()
			return await context.category.fetchAll()
		}
	}
}

const mutations = {

	createCategory: {
		type: CategoryType,
		args: {
			//token: //shuld be here
			name: { type: new GraphQLNonNull(GraphQLString) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			return context.category.create({ name: args.name })
		}
	},

	deleteCategory: {
		type: CategoryType,
		args: {
			// token: //should be here
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var context = new Context()
			return await context.category.delete(args._id)
		}
	}

}


export default { queries, mutations }