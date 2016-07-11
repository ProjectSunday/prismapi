import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull } from 'graphql/type'

// import { UserType } 		from './schema-user'
import { User } 	from '~/backend/backend'

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

			var user = new User({
				meetup: {
					email: 'blahemail',
					password: 'password'
				}
			})

			await user.getAccessToken();

			return {
				result: 'blah'
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