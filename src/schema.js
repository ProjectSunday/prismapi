import { GraphQLObjectType, GraphQLSchema, GraphQLInt } from 'graphql/type'

let count = 0

let Schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {

			categories: {
				type: 
			},
			count: {
				type: GraphQLInt,
				resolve: () => {
					return count
				}
			}
		}
	})
})

export default Schema