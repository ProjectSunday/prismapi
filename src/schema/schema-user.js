import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { User } from '~/backend/backend'

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
			//security check here

			var self = new User(args.token)
			await self.fetch()
			return self.data

			// await self.fetch(args.token)
			// return self
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
		resolve: async (root, args) => {
			var user = new User(args.token)
			await user.authenticate()
			return user.data
		}

	}
}


/////////////////////////////////////////////////////////////////////////////

export default { queries, mutations }