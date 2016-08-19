import { randomBytes } from 'crypto'
import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import CategorySchema 		from './category-schema'
import RequestedClass 	from './requestedclass-schema'

import Testing			from './testing-schema'


import { Category, Context, UpcomingClass, User } from '~/backend/backend'


import { CategoryType, MeetupType, UpcomingClassType, UserType } from './types'


////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingClassSchema
////////////////////////////////////////////////////////////////////////////////////////////////////


function UpcomingClassSchema () {
	return {
		queries: {
			upcomingClass: {
				type: UpcomingClassType,
				args: {
					_id: { type: GraphQLID }
				},
				resolve: async (root, args) => {
					var context = new Context()
					context.upcomingClass._id = args._id
					var upcoming = new UpcomingClass(context)
					await upcoming.fetch()
					return context.upcomingClass
				}
			},
			upcomingClasses: {
				type: new GraphQLList(UpcomingClassType),
				resolve: async (root, args) => {
					var context = new Context()
					var upcoming = new UpcomingClass(context)
					await upcoming.getAll()
					return context.upcomingClasses
				}
			}
		},
		mutations: {
			createUpcomingClass: {
				type: UpcomingClassType,
				args: {
					token: { type: GraphQLString },
					categoryId: { type: GraphQLID },
					name: { type: GraphQLString }
				},
				resolve: async (root, args) => {
					var context = new Context()

					await context.user.fetch({ token: args.token })
					await context.user.ensureOrganizer()

					await context.category.fetch({ _id: args.categoryId })

					await context.upcomingClass.create2({ name: args.name })

					var upcomingClass = Object.assign({}, context.upcomingClass)
					delete upcomingClass.context

					return upcomingClass
				}
			},
			deleteUpcomingClass: {
				type: UpcomingClassType,
				args: {
					token: { type: GraphQLString },
					_id: { type: GraphQLID }
				},
				resolve: async (root, args) => {
					var context = new Context()
					
					await context.user.read({ token: args.token })
					await context.upcomingClass.delete({ _id: args._id })

					var { _id, status } = context.upcomingClass

					return { _id, status }
				}
			}
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
//UserSchema
////////////////////////////////////////////////////////////////////////////////////////////////////


function UserSchema() {
	return {
		queries: {
			user: {
				type: UserType,
				args: {
					token: { type: new GraphQLNonNull(GraphQLString) }
				},
				resolve: async (root, args) => {
					var user = new User()
					await user.read({ token: args.token })
					delete user.context
					delete user.meetup.token
					return user
				}
			}
		},
		mutations: {
			authenticateViaMeetup: {
				type: UserType,
				args: {
					token: { type: GraphQLString }
				},
				resolve: async (root, args) => {
					var user = new User()
					await user.authenticateViaMeetup(args.token)
					delete user.context
					delete user.meetup.token
					return user
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
			},
			logoutUser: {
				type: UserType,
				args: {
					token: { type: new GraphQLNonNull(GraphQLString) }
				},
				resolve: async (root, args) => {
					var context = new Context()
					await context.user.logout({ token: args.token })
					return {
						_id: context.user._id,
						status: context.user.status
					}
				}
			}
		}
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

var userSchema = UserSchema()
var upcomingClassSchema = new UpcomingClassSchema()

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		...CategorySchema.queries,
		...RequestedClass.Queries,
		...upcomingClassSchema.queries,
		...userSchema.queries,

		...Testing.Queries
	}
})

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		...CategorySchema.mutations,
		...RequestedClass.Mutations,
		...upcomingClassSchema.mutations,
		...userSchema.mutations
	}
})

export default new GraphQLSchema({ query, mutation })


