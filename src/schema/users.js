import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { users } from '~/data/data'

const MeetupProfileType = new GraphQLObjectType({
	name: 'MeetupProfile',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString }
	})
})

const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		_id: { type: GraphQLID },
		meetup: {
			type: MeetupProfileType,
			resolve: (user) => {
				return user.meetup
			}
		},
		status: { type: GraphQLString }
	})
})


export const UserQuery = {
	type: UserType,
	args: {
		token: { type: GraphQLString }
	},
	resolve: (root, args) => {
		return users.read(args.token)
	}
}

