import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { categories } from './db'

const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		id: { type: GraphQLID },
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
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return categories.delete(args.id)
	}
}
