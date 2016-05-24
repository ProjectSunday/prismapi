import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { categories } from './db'

const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})


export const Categories = {
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
}

export const CreateCategory = {
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

export const RemoveCategory = {
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
