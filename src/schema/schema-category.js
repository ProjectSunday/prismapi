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
			var category = new Category(context)
			await category.fetchAll()
			return context.categories
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
			context.category.name = args.name
			var category = new Category(context)
			await category.create()
			return context.category
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
			context.category._id = args._id
			var category = new Category(context)
			await category.delete()
			return context.category
		}
	}

}


export default { queries, mutations }