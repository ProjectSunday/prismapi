import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import Category 		from './schema-category'
import RequestedClass 	from './schema-requestedclass'
import UpcomingClass 	from './upcomingclass'
import User 			from './schema-user'

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		...Category.queries,
		...RequestedClass.queries,
		...User.queries
	}
})

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		...Category.mutations,
		...RequestedClass.mutations,
		...UpcomingClass.Mutations,
		...User.mutations
	}
})

export default new GraphQLSchema({ query, mutation })