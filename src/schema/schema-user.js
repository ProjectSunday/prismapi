import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

import { Context, User } from '~/backend/backend'

import { randomBytes } from 'crypto'

const PhotoType = new GraphQLObjectType({
	name: 'PhotoType',
	fields: () => ({
		thumb_link: { type: GraphQLString }
	})
})

const MemberType = new GraphQLObjectType({
	name: 'MemberType',
	fields: () => ({
		id: { type: GraphQLInt },
		name: { type: GraphQLString },
		photo: { type: PhotoType }
	})
})

const MeetupType = new GraphQLObjectType({
	name: 'MeetupType',
	fields: () => ({
		token: { type: GraphQLString },
		member: { type: MemberType }
	})
})

export const UserType = new GraphQLObjectType({
	name: 'UserType',
	fields: () => ({
		_id: { type: GraphQLID },
		meetup: { type: MeetupType },
		token: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})

/////////////////////////////////////////////////////////////////////////////

const Queries = {
	user: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var context = new Context()
			await context.user.fetch(args.token)
			return context.user.get()
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

const Mutations = {
	authenticate: {
		type: UserType,
		args: {
			meetupEmail: { type: GraphQLString },
			meetupPassword: { type: GraphQLString}
		},
		resolve: async (root, args) => {
			var context = new Context()
			context.user.meetupEmail = args.meetupEmail
			context.user.meetupPassword = args.meetupPassword
			await context.user.authenticate()
			return context.user.get()
		}
	},
	authenticateViaMeetup: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var user = new User()
			await user.authenticateViaMeetup(args.token)
			return user.toJSON()
		}
	},
	createUser: {
		type: UserType,
		args: {
			//todo: token
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var context = new Context()
			return await context.user.create({ name: args.name })
		}
	},
	deleteUser: {
		type: UserType,
		args: {
			//todo: token
			_id: { type: GraphQLID }
		},
		resolve: async (root, args) => {
			var context = new Context()
			return await context.user.delete({ _id: args._id })
		}
	}
}


/////////////////////////////////////////////////////////////////////////////

export default { Queries, Mutations }