import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { CategoryType } from './categories'
import { requestedClasses, categories } from '../data/data'

const RequestedClassType = new GraphQLObjectType({
	name: 'RequestedClass',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: { 
			type: CategoryType,
			resolve: (requestedClass) => {
				return categories.read(requestedClass.category)
			}
		},
		date: { type: GraphQLString }, //this is wrong
		location: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

export const RequestedClasses = {
	type: new GraphQLList(RequestedClassType),
	resolve: () => {
		return requestedClasses.read()
	}
}

export const CreateRequestedClass = {
	type: RequestedClassType,
	args: {
		name: { type: new GraphQLNonNull(GraphQLString) },
		category: { type: GraphQLID }
	},
	resolve: (root, args) => {
		return new Promise((resolve, reject) => {  //just for testing purpose
			setTimeout(() => {
				requestedClasses.create({ name: args.name, category: args.category }).then(resolve, reject)
			}, 5000)  //delaying for testing purpose
		})
	}
}

export const DeleteRequestedClass = {
	type: RequestedClassType,
	args: {
		_id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return requestedClasses.delete(args._id)
	}
}


