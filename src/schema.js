import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { categories } from './db'

let count = 0

const CategoryType = new GraphQLObjectType({
	name: 'Category',
	fields: () => ({
		// _id: { type: GraphQLString },
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString }
	})
})


const QueryType = new GraphQLObjectType({
	name: 'Query',
	fields: () => {
		return {
			categories: {
				type: new GraphQLList(CategoryType),
				resolve: () => {
					return categories().find().toArray()
				}
			},
			count: {
				type: GraphQLInt,
				resolve: () => {
					return count
				}
			}

		}
	}
})


const MutationAdd = {
	type: CategoryType,
	args: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {
			categories().insertOne({ name: args.name }).then(r => {
				categories().find({ _id: r.insertedId }).toArray().then(docs => {
					var cat = docs[0]
					cat.id = docs[0]._id
					resolve(cat)
				})
			})
		})
	}
}

const RemoveCategory = {
	type: GraphQLObjectType,
	args: {
		name: {
			type: new GraphQLNonNull(GraphQLString)
		}
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {
			categories().deleteOne({ name: args.name }).then((r,a,b,c) => {

				// console.log('44444', r,a,b,c)

				resolve(r.deletedCount)
			})
		})
	}
}


const MutationType = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		add: MutationAdd,
		removeCategory: RemoveCategory
	}
})

const schema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
})

export default schema