import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID } from 'graphql/type'

import db from './data/database'

let count = 0

const Category = new GraphQLObjectType({
	name: 'Category',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString }
	})
})

const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {

			categories: {
				type: new GraphQLList(Category),
				resolve: (obj, a, b) => {
					console.log('obj', obj, a, b)

					var newcat = { id: 4, name: 'qwerwerwerwer', imageName: 'imageName4444'};

					db.write({ categories: [ newcat ]})

					return db.read().categories
				}
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

export default schema