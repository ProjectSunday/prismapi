import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { categories } from './db'

export const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})


export const Categories = {
	type: new GraphQLList(CategoryType),
	resolve: () => {
		return categories.read()
	}
}

export const CreateCategory = {
	type: CategoryType,
	args: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve: (root, args) => {
		return categories.create({ name: args.name })
	}
}

export const DeleteCategory = {
	type: CategoryType,
	args: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return categories.delete(args._id)
	}
}
