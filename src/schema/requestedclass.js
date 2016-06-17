import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './category'
import db from '~/data/db'

const RequestedClassType = new GraphQLObjectType({
	name: 'RequestedClass',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: {
			type: CategoryType,
			resolve: (requestedClass) => {
				return db.category.read(requestedClass.category)
			}
		},
		date: { type: GraphQLString }, //this is wrong
		location: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

const queries = {

	requestedClasses: {
		type: new GraphQLList(RequestedClassType),
		resolve: () => {
			return db.requestedClass.read()
		}
	}

}

const mutations = {

	createRequestedClass: {
		type: RequestedClassType,
		args: {
			name: { type: new GraphQLNonNull(GraphQLString) },
			category: { type: GraphQLID }
		},
		resolve: (root, args) => {
			return new Promise((resolve, reject) => {  //just for testing purpose
				setTimeout(() => {
					db.requestedClass.create({ name: args.name, category: args.category }).then(resolve, reject)
				}, 5)  //delaying for testing purpose
			})
		}
	},

	deleteRequestedClass: {
		type: RequestedClassType,
		args: {
			_id: { type: new GraphQLNonNull(GraphQLID) }
		},
		resolve: (root, args) => {
			return db.requestedClass.delete(args._id)
		}
	}

}

export default { queries, mutations }


