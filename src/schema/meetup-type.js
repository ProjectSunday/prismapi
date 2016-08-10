import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLID } from 'graphql/type'

export const MeetupType = new GraphQLObjectType({
	name: 'MeetupType',
	fields: () => ({
		token: { type: GraphQLString },
		event: { type: EventType },
		member: { type: MemberType }

	})
})

export const EventType = new GraphQLObjectType({
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
