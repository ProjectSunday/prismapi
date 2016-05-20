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

// export const RequestedClassQuery = {
// 	type: RequestedClassType,
// 	args: {
// 		id: {
// 			type: new GraphQLNonNull(GraphQLString)
// 		}
// 	},
// 	resolve: (root, args) => {
// 		return new Promise((resolve, reject) => {
// 			requestedClasses().find(_id: args.id).toArray().then(r => {
// 				console.log('11111', r)
// 				r.id = r._id
// 				delete r._id
// 				resolve(r)
// 			})
// 		})
// 	}
// }

export const RequestedClassesQuery = {
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


// export const AddRequestedClassMutation = {
// 	type: RequestedClassType,
// 	args: {
// 		name: {
// 			type: new GraphQLNonNull(GraphQLString)
// 		}
// 	},
// 	resolve: (root, args) => {
// 		return new Promise((resolve, reject) => {
// 			categories().insertOne({ name: args.name }).then(r => {
// 				categories().find({ _id: r.insertedId }).toArray().then(docs => {
// 					var cat = docs[0]
// 					cat.id = docs[0]._id
// 					resolve(cat)
// 				})
// 			})
// 		})
// 	}
// }

// export const RemoveRequestedClassMutation = {
// 	type: RequestedClassType,
// 	args: {
// 		id: {
// 			type: new GraphQLNonNull(GraphQLID)
// 		}
// 	},
// 	resolve: (root, args) => {
// 		return new Promise((resolve, reject) => {
// 			categories().deleteOne({ _id: args.id }).then((r) => {
// 				resolve({ id: args.id, status: 'DELETE_SUCCESS' })
// 			})
// 		})
// 	}
// }


