import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import Category 		from './schema-category'
import RequestedClass 	from './requestedclass-schema'
import UpcomingClass 	from './upcomingclass-schema'
import User 			from './schema-user'

import Testing			from './schema-testing'

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		...Category.queries,
		...RequestedClass.Queries,
		...UpcomingClass.Queries,
		...User.Queries,

		...Testing.Queries
	}
})

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		...Category.mutations,
		...RequestedClass.Mutations,
		...UpcomingClass.Mutations,
		...User.Mutations
	}
})

export default new GraphQLSchema({ query, mutation })