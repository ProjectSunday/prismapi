import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { requestedClasses } from './db'

const RequestedClassType = new GraphQLObjectType({
	name: 'RequestedClass',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

export const RequestedClassQuery = {
	type: new GraphQLList(RequestedClassType),
	resolve: () => {
		return new Promise((resolve, reject) => {
			requestedClasses().find().toArray().then(result => {
				var requested = result.map(r => {
					r.id = r._id
					delete r._id
					return r
				})
				resolve(requested)
			})
		})
	}
}


export const CreateRequestedClassMutation = {
	type: RequestedClassType,
	args: {
		name: { type: new GraphQLNonNull(GraphQLString) }
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {
			requestedClasses().insertOne({ name: args.name }).then(r => {
				requestedClasses().find({ _id: r.insertedId }).toArray().then(docs => {
					var requested = docs[0]
					requested.id = docs[0]._id
					resolve(requested)
				})
			})
		})
	}
}


export const DeleteRequestedClassMutation = {
	type: RequestedClassType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {
			requestedClasses().deleteOne({ _id: args.id }).then((r) => {
				resolve({ id: args.id, status: 'DELETE_SUCCESS' })
			})
		})
	}
}


