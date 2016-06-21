import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { User, default as db } from '~/data/db'
import meetup from '~/meetup/meetup'

const PhotoType = new GraphQLObjectType({
	name: 'PhotoType',
	fields: () => ({
		thumb_link: { type: GraphQLString }
	})
})

const meetupMemberType = new GraphQLObjectType({
	name: 'MeetupProfile',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		photo: { type: PhotoType },
		token: { type: GraphQLString }
	})
})

export const UserType = new GraphQLObjectType({
	name: 'User',
	fields: () => ({
		_id: { type: GraphQLID },
		meetupMember: {
			type: meetupMemberType,
			resolve: (user) => {
				return user.meetupMember
			}
		},
		status: { type: GraphQLString }
	})
})

/////////////////////////////////////////////////////////////////////////////

const queries = {
	user: {
		type: UserType,
		args: {
			_id: { type: GraphQLID },
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var requester = new User(args.token)
			// await requester.hasRole('')

			return db.user.read(args.token)
		}
	},
	self: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var self = new User(args.token)
			await self.fetch()
			return self
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

const mutations = {
	authenticateUser: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: authenticateUser
	}
}

async function authenticateUser(root, args) {
	var user = new User()
	await user.authenticate(args.token)
	return user
}

/////////////////////////////////////////////////////////////////////////////

export default { queries, mutations }