import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { users } from '~/data/data'
import meetup from '~/meetup/meetup'

const PhotoType = new GraphQLObjectType({
	name: 'PhotoType',
	fields: () => ({
		thumb_link: { type: GraphQLString }
	})
})

const MeetupProfileType = new GraphQLObjectType({
	name: 'MeetupProfile',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		photo: { type: PhotoType }
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
	resolve: authenticateUser
}

async function authenticateUser(root, args) {
	var m = await meetup.getMember(args.token)
	return await users.getFromMeetupProfile(m, args.token)
}
