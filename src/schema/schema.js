import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import Category 		from './category'
import RequestedClass 	from './requestedclass'
import UpcomingClass 	from './upcomingclass'
import User 			from './user'

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