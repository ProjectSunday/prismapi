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

export const RequestedClasses = {
	type: new GraphQLList(RequestedClassType),
	resolve: () => {
		return requestedClasses.read()
	}
}

export const CreateRequestedClass = {
	type: RequestedClassType,
	args: {
		name: { type: new GraphQLNonNull(GraphQLString) }
	},
	resolve: (root, args) => {
		return requestedClasses.create({ name: args.name })
	}
}

export const DeleteRequestedClass = {
	type: RequestedClassType,
	args: {
		id: {
			type: new GraphQLNonNull(GraphQLID)
		}
	},
	resolve: (root, args) => {
		return requestedClasses.delete(args.id)
	}
}


