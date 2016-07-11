import { ObjectID } from 'mongodb'

import { Read, Update }	from './db'
import { Member }		from './meetup'

import request from 'request'
import entities from 'entities'

import Browser from 'zombie'


export class User {
	/*
		context: {
			token: 'xxxx',
			meetup: {
				email: 'xxx@xxx.com',
				password: 'xxx'
			}
		}
	*/
	constructor(context) {
		this.context = context
		this._data = {}
	}
	get data() { return this._data }
	set data(d) { this._data = d }

	async fetch() {
		var user = await Read('users', { token: this.context.token })
		if (!user) { throw 'User not found.' }

		//also get meetup profile here, maybe?
		this.data = user

		return this
	}

	async save() {
		await Update('users', { _id: ObjectID(this.data._id ) }, this.data)
	}

	async authenticate() {

		var member = new Member(this.context)
		await member.fetch()

		var filter = { 'meetupMember.id': member.data.id }
		var value = {
			token: this.context.token,
			meetupMember: member.data
		}
		var user = await Update("users", filter, value)

		this.data = user

		return this
	}

	async ensureOrganizer() {

		var member = new Member(this.context)
		member.data = this.data.meetupMember
		await member.fetchRole()

	    if (member.data.role !== 'Event Organizer' || member.data.role !== 'Organizer') {
	    	await member.promoteToEventOrganizer()
	    	this.data.meetupMember = member.data
	    	await this.save()
	    }

	}

	async getAccessToken() {
		// log(this.context.meetup, 'meetup')

		var token, returnUri, op, apiAppName


		var request = request.defaults({jar: true});


		request('https://secure.meetup.com/oauth2/authorize?client_id=sgeirri963sprv1a1vh3r8cp3o&response_type=token&scope=basic+event_management&redirect_uri=http://localhost:7000/authentication', (a,b, body) => {
			// console.log(a, 'a')
			// console.log(b, 'b')
			// console.log(body, 'c')



			token = body.match(/name="token" value="(.*)"/)[1];
			// log(token, 'token')

			returnUri = body.match(/name="returnUri" value="(.*)"/)[1]
			returnUri = entities.decodeHTML(returnUri)


			// log(returnUri, 'returnUri')


			op = body.match(/name="op" value="(.*)"/)[1]
			// log(op, 'op')

			apiAppName = body.match(/name="apiAppName" value="(.*)"/)[1]
			// log(apiAppName)

			// var url = body.match(/form action="([^"]*)/)[1]

			// log(url)


/*

email:locallearnersuser@gmail.com
password:thirstyscholar1
rememberme:on
token:cd4df6ab-dfbc-4ac8-807a-43208d34fd1e
submitButton:Log in and Grant Access
returnUri:https://secure.meetup.com/oauth2/authorize/?submit=1&response=yes&scope=basic+event_management&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A7000%2Fauthentication&client_id=sgeirri963sprv1a1vh3r8cp3o&sig=66f5ca0626d79ee70d0439b9064ffd183501ed12
op:login
apiAppName:Prism Dev

*/
			//https://secure.meetup.com/login/


			// meetupLogin()

			var form = {
				email: 'locallearnersuser@gmail.com',
				password: 'thirstyscholar1',
				rememberme: 'on',
				token,
				submitButton: 'Log in and Grant Access',
				returnUri,
				op,
				apiAppName
			}

			log(form,'form')

			request.post('https://secure.meetup.com/login/', { form }, function (a,b,c) {
				console.log(c)
			})





		})


		function meetupLogin() {

			var form = {
				email: 'locallearnersuser@gmail.com',
				password: 'thirstyscholar1',
				rememberme: 'on',
				token,
				submitButton: 'Log in and Grant Access',
				returnUri,
				op,
				apiAppName
			}

			log(form,'form')

			request.post('https://secure.meetup.com/login/', { form }, function (a,b,c) {
				console.log(c)
			})
		}


/*
<form action="https://secure.meetup.com/login/" method="post" id="loginForm" class="loginForm">

*/

	}
}