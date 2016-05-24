import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import { categories } from './db'
import { RequestedClassQuery, CreateRequestedClassMutation, DeleteRequestedClassMutation } from './requestedclasses'

const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})


const QueryType = new GraphQLObjectType({
	name: 'QueryType',
	fields: () => {
		return {
			categories: {
				type: new GraphQLList(CategoryType),
				resolve: () => {
					return new Promise((resolve, reject) => {
						categories().find().toArray().then(result => {
							var categories = result.map(r => {
								r.id = r._id
								delete r._id
								return r
							})
							resolve(categories)
						})
					})
				}
			},
			requestedClasses: RequestedClassQuery
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
	type: CategoryType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {
			categories().deleteOne({ _id: args.id }).then((r) => {
				resolve({ id: args.id, status: 'DELETE_SUCCESS' })
			})
		})
	}
}


const MutationType = new GraphQLObjectType({
	name: 'MutationType',
	fields: {
		add: MutationAdd,
		removeCategory: RemoveCategory,
		createRequestedClass: CreateRequestedClassMutation,
		deleteRequestedClass: DeleteRequestedClassMutation
	}
})

const schema = new GraphQLSchema({
	query: QueryType,
	mutation: MutationType
})

export default schema