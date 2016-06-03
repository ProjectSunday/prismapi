import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { users } from '~/data/data'
import { getMember } from '~/meetup/meetup'

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
		token: { type: GraphQLString },
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

export const AuthenticateUserMutation = {
	type: UserType,
	args: {
		token: { type: GraphQLString }
	},
	resolve: (root, args) => {
		return getMember(args.token).then(m => {
			return users.getFromMeetupProfile(m, args.token)
		})
	}
}