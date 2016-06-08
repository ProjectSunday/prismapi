import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import db from '../data/db'

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
		resolve: () => {
			return db.category.read()
		}
	}
}

const mutations = {

	createCategory: {
		type: CategoryType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) }
		},
		resolve: (root, args) => {
			return db.category.create({ name: args.name })
		}
	},

	deleteCategory: {
		type: CategoryType,
		args: {
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: (root, args) => {
			return db.category.delete(args._id)
		}
	}

}


export default { queries, mutations }