import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import { Categories, CreateCategory, RemoveCategory } from './categories'
import { RequestedClasses, CreateRequestedClass, DeleteRequestedClass } from './requestedclasses'

const QueryType = new GraphQLObjectType({
	name: 'QueryType',
	fields: () => {
		return {
			categories: Categories,
			requestedClasses: RequestedClasses
		}
	}
})

const MutationType = new GraphQLObjectType({
	name: 'MutationType',
	fields: {
		createCategory: CreateCategory,
		removeCategory: RemoveCategory,
		createRequestedClass: CreateRequestedClass,
		deleteRequestedClass: DeleteRequestedClass
	}
})

const schema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
})

export default schema