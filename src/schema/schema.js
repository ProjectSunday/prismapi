import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import { Categories, CreateCategory, DeleteCategory } from './categories'
import { RequestedClasses, CreateRequestedClass, DeleteRequestedClass } from './requestedclasses'
import { User } from './users'

const QueryType = new GraphQLObjectType({
	name: 'QueryType',
	fields: () => {
		return {
			categories: Categories,
			requestedClasses: RequestedClasses,
			user: User
		}
	}
})

const MutationType = new GraphQLObjectType({
	name: 'MutationType',
	fields: {
		createCategory: CreateCategory,
		deleteCategory: DeleteCategory,
		createRequestedClass: CreateRequestedClass,
		deleteRequestedClass: DeleteRequestedClass
	}
})

const schema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
})

export default schema