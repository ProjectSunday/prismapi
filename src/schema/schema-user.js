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

const Queries = {
	user: {
		type: UserType,
		args: {
			token: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			// var context = new Context()
			// context.user.token = args.token
			// await context.user.fetch()
			// return context.user.get()
			return { blah: 'blah'}
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
			// var context = new Context()
			// context.user.meetupEmail = args.meetupEmail
			// context.user.meetupPassword = args.meetupPassword
			// t(1)
			console.log(context, 'context')
			// await context.user.authenticate()
			// return context.user.get()
			return { blah: 'blah '}
		}
	}
}


/////////////////////////////////////////////////////////////////////////////

export default { Queries, Mutations }