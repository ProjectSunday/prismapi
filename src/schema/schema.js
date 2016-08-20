import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'

import { CategoryType, MeetupType, RequestedClassType, UpcomingClassType, UserType } from './types'
import { Category, Context, UpcomingClass, User, Testing } from '~/backend/backend'

var categorySchema = new CategorySchema()
var requestedClassSchema = new RequestedClassSchema()
var userSchema = new UserSchema()
var upcomingClassSchema = new UpcomingClassSchema()
var testingSchema = new TestingSchema()

const query = new GraphQLObjectType({
	name: 'query',
	fields: {
		...categorySchema.queries,
		...requestedClassSchema.Queries,
		...upcomingClassSchema.queries,
		...userSchema.queries,

		...testingSchema.queries
	}
})

const mutation = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		...categorySchema.mutations,
		...requestedClassSchema.Mutations,
		...upcomingClassSchema.mutations,
		...userSchema.mutations
	}
})

export default new GraphQLSchema({ query, mutation })


////////////////////////////////////////////////////////////////////////////////////////////////////
//CategorySchema
////////////////////////////////////////////////////////////////////////////////////////////////////
function CategorySchema() {
	return {
		queries: {
			categories: {
				type: new GraphQLList(CategoryType),
				resolve: async () => {
					return await Category.readAll()
				}
			}
		},
		mutations: {

			// createCategory: {
			// 	type: CategoryType,
			// 	args: {
			// 		//token: //shuld be here
			// 		name: { type: new GraphQLNonNull(GraphQLString) }
			// 	},
			// 	resolve: async (root, args) => {
			// 		var context = new Context()
			// 		return context.category.create({ name: args.name })
			// 	}
			// },

			// deleteCategory: {
			// 	type: CategoryType,
			// 	args: {
			// 		// token: //should be here
			// 		_id: { type: new GraphQLNonNull(GraphQLID) }
			// 	},
			// 	resolve: async (root, args) => {
			// 		var context = new Context()
			// 		return await context.category.delete(args._id)
			// 	}
			// }

		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//RequestedClassSchema
////////////////////////////////////////////////////////////////////////////////////////////////////
function RequestedClassSchema() {
	return {
		queries: {
			requestedClasses: {
				type: new GraphQLList(RequestedClassType),
				resolve: async () => {
					var context = new Context()
					var requestedClass = new RequestedClass(context)
					await requestedClass.fetchAll()
					return context.requestedClasses
				}
			}
		},
		mutations: {
			createRequestedClass: {
				type: RequestedClassType,
				args: {
					token: { type: new GraphQLNonNull(GraphQLString) },
					name: { type: new GraphQLNonNull(GraphQLString) },
					categoryId: { type: new GraphQLNonNull(GraphQLID) }
				},
				resolve: async (root, args) => {
					var context = new Context()

					await context.user.read({ token: args.token })
					await context.category.read({ _id: args.categoryId })
					await context.requestedClass.create({ name: args.name })
					
					delete context.requestedClass.context

					return context.requestedClass
				}
			},
			deleteRequestedClass: {
				type: RequestedClassType,
				args: {
					//TODO: token to check to see if user is authorized to delete
					_id: { type: new GraphQLNonNull(GraphQLID) }
				},
				resolve: async (root, args) => {
					var context = new Context()

					await context.requestedClass.delete({ _id: args._id })

					var { _id, status } = context.requestedClass
					return { _id, status }
				}
			},
			addInterestedUser: {
				type: RequestedClassType,
				args: {
					token: { type: new GraphQLNonNull(GraphQLString) },
					_id: { type: new GraphQLNonNull(GraphQLID) }
				},
				resolve: async (root, args) => {
					var context = new Context()

					await context.user.read({ token: args.token })
					await context.requestedClass.addInterestedUser({ _id: args._id })

					return context.requestedClass
				}
			},
			removeInterestedUser: {
				type: RequestedClassType,
				args: {
					token: { type: new GraphQLNonNull(GraphQLString) },
					_id: { type: new GraphQLNonNull(GraphQLID) }
				},
				resolve: async (root, args) => {
					var context = new Context()

					await context.user.read({ token: args.token })
					await context.requestedClass.removeInterestedUser({ _id: args._id })

					return context.requestedClass
				}
			}
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//TestingSchema
////////////////////////////////////////////////////////////////////////////////////////////////////
function TestingSchema() {
	const TestingType = new GraphQLObjectType({
		name: 'TestingType',
		fields: () => ({
			result: { type: GraphQLString }
		})
	})

	return {
		queries: {
			testing: {
				type: TestingType,
				// args: {
				// 	_id: { t÷ype: GraphQLID }
				// },
				resolve: async (root, args) => {

					// var testing = new Testing()
					// await testing.test()

					return { result: 'blah'}

				}
			}
		}
	}
}
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

					await context.user.read({ token: args.token })
					await context.user.ensureOrganizer()

					await context.category.read({ _id: args.categoryId })

					await context.upcomingClass.create({ name: args.name })

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

