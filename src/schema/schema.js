import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import Category 		from './category-schema'
import RequestedClass 	from './requestedclass-schema'
import UpcomingClass 	from './upcomingclass-schema'
import User 			from './user-schema'

import Testing			from './testing-schema'

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