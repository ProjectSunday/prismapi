import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { Category } from '~/backend/backend'

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
			var category = new Category()
			return await category.getAll()
		}
	}
}

const mutations = {

	createCategory: {
		type: CategoryType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) }
		},
		resolve: async (root, args) => {
			var category = new Category()
			return await category.save({ name: args.name })
		}
	},

	deleteCategory: {
		type: CategoryType,
		args: {
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: async (root, args) => {
			var category = new Category()
			return await category.delete(args._id)
			// return 'balh'
			// return db.category.delete(args._id)
		}
	}

}


export default { queries, mutations }