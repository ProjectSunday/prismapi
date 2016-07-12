import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { Context, User } from '~/backend/backend'

const PhotoType = new GraphQLObjectType({
	name: 'PhotoType',
	fields: () => ({
		thumb_link: { type: GraphQLString }
	})
})

const meetupMemberType = new GraphQLObjectType({
	name: 'MeetupMember',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		photo: { type: PhotoType }
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
		token: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

/////////////////////////////////////////////////////////////////////////////

const queries = {
	user: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var ctx = new Context()
			ctx.token = args.token

			var user = new User(ctx)
			await user.fetch()

			return user.data
		}
	}
	// self: {
	// 	type: UserType,
	// 	args: {
	// 		token: { type: GraphQLString }
	// 	},
	// 	resolve: async (root, args) => {
	// 		//security check here
	// 		var context = { token: args.token }
	// 		var self = await new User(context).fetch()
	// 		return self.data

	// 		// await self.fetch(args.token)
	// 		// return self
	// 	}
	// }
}

/////////////////////////////////////////////////////////////////////////////

const mutations = {
	// authenticateUser: {
	// 	type: UserType,
	// 	args: {
	// 		token: { type: GraphQLString }
	// 	},
	// 	resolve: async (root, args) => {
	// 		var context = { token: args.token }
	// 		var user = await new User(context).authenticate()
	// 		return user.data
	// 	}

	// },
	authenticate: {
		type: UserType,
		args: {
			meetupEmail: { type: GraphQLString },
			meetupPassword: { type: GraphQLString}
		},
		resolve: async (root, args) => {
			var ctx = new Context()
			ctx.meetupEmail = args.meetupEmail
			ctx.meetupPassword = args.meetupPassword

			var user = new User(ctx)
			await user.authenticate()

			return user.data
		}
	}
}


/////////////////////////////////////////////////////////////////////////////

export default { queries, mutations }