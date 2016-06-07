import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import { Categories, CreateCategory, DeleteCategory } from './categories'
import { RequestedClasses, CreateRequestedClass, DeleteRequestedClass } from './requestedclasses'

import Users from './users'

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		categories: Categories,
		requestedClasses: RequestedClasses,
		...Users.queries
	}
})

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		createCategory: CreateCategory,
		deleteCategory: DeleteCategory,
		createRequestedClass: CreateRequestedClass,
		deleteRequestedClass: DeleteRequestedClass,
		...Users.mutations
	}
})

export default new GraphQLSchema({ query, mutation })