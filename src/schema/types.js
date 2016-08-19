import { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLOutputType } from 'graphql/type'


////////////////////////////////////////////////////////////////////////////////////////////////////
//Category
////////////////////////////////////////////////////////////////////////////////////////////////////

export const CategoryType = new GraphQLObjectType({
	name: 'CategoryType',
	fields: () => ({
		_id: { type: GraphQLID },
		key: { type: GraphQLInt },
		name: { type: GraphQLString },
		imageName: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})


////////////////////////////////////////////////////////////////////////////////////////////////////
//Meetup
////////////////////////////////////////////////////////////////////////////////////////////////////

export const MeetupType = new GraphQLObjectType({
	name: 'MeetupType',
	fields: () => ({
		token: { type: GraphQLString },
		event: { type: EventType },
		member: { type: MemberType }

	})
})

const EventType = new GraphQLObjectType({
	name: 'EventType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString }
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

const PhotoType = new GraphQLObjectType({
	name: 'PhotoType',
	fields: () => ({
		thumb_link: { type: GraphQLString }
	})
})


////////////////////////////////////////////////////////////////////////////////////////////////////
//UpcomingClass
////////////////////////////////////////////////////////////////////////////////////////////////////

export const UpcomingClassType = new GraphQLObjectType({
	name: 'UpcomingClassType',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		category: { type: CategoryType },
		event: { type: EventType },
		teachers: { type: new GraphQLList(UserType) },
		status: { type: GraphQLString }
	})
})


////////////////////////////////////////////////////////////////////////////////////////////////////
//User
////////////////////////////////////////////////////////////////////////////////////////////////////

export const UserType = new GraphQLObjectType({
	name: 'UserType',
	fields: () => ({
		_id: { type: GraphQLID },
		meetup: { type: MeetupType },
		token: { type: GraphQLString },
		status: { type: GraphQLString }
	})
})


