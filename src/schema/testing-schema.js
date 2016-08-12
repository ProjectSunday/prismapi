import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

// import { UserType } 		from './schema-user'
import { Context, User } 	from '~/backend/backend'

import request from 'request'

/////////////////////////////////////////////////////////////////////////////

const TestingType = new GraphQLObjectType({
	name: 'TestingType',
	fields: () => ({
		result: { type: GraphQLString }
	})
})

// const MeetupEventType = new GraphQLObjectType({
// 	name: 'MeetupEventType',
// 	fields: () => ({
// 		id: { type: GraphQLInt },
// 		name: { type: GraphQLString }
// 	})
// })

/////////////////////////////////////////////////////////////////////////////

const Queries = {
	testing: {
		type: TestingType,
		// args: {
		// 	_id: { t÷ype: GraphQLID }
		// },
		resolve: async (root, args) => {

			var ctx = new Context()
			ctx.meetupEmail = 'locallearnersuser@gmail.com'
			ctx.meetupPassword = 'thirstyscholar1'

			await new User(ctx).getAccessToken()

			return {
				result: ctx.token
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////////

/*
const Mutations = {
	createUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			name: { type: GraphQLString }
		},
		resolve: async (root, args) => {
			var context = { token: args.token }
			var event = { name: args.name }
			var upcoming = await new UpcomingClass(context).create(event)
			return upcoming.data
		}
	},
	deleteUpcomingClass: {
		type: UpcomingClassType,
		args: {
			token: { type: GraphQLString },
			_id: { type: GraphQLID }
		},
		resolve: async (root, args) => {
			var context = { token: args.token }
			var upcoming = await new UpcomingClass(context).delete(args._id)
			return upcoming.data
		}
	}

*/


/////////////////////////////////////////////////////////////////////////////

export default { Queries }
// export default { Mutations, Queries }