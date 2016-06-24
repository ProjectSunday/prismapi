import { Create, User } 	from './db'
import { Event } 			from './meetup'

export class UpcomingClass {
	constructor(token) {
		this.token = token
	}
	get data() { return this._data || {} }
	set data(d) { this._data = d }

	async create() {
		var user = new User(this.token)
		await user.fetch()
		t(1)
		await user.ensureOrganizer()
		this.data.teacher = user.data._id

		var event = new Event(this.token)
		event.data = this.data.event
		await event.post()

		await this.save()
	}

	async save() {
		await Create('upcomingclasses', this.data)
	}
	// async fetch() {
	// 	if (!this.token) { throw 'Not authorized.' }

	// 	var users = await _db.collection('users').find({ 'meetupMember.token': this.token }).toArray()
	// 	if (!users.length) { throw 'User not found.' }

	// 	//also get meetup profile here

	// 	Object.assign(this, users[0])
	// }
}






























function findLongestWord(str) {
	var splitString = str.split(' ');
	var strToNum = [];

	//get the item of the array
	//get the length of the item of the array

	for (var i = 0; i < splitString.length; i++) {
	var j = splitString[i].length;
	//console.log(j);
	strToNum.push(j);
	}

	var sorted = strToNum.sort(function(a, b){return a-b});
	//console.log(sorted);

	return sorted[sorted.length - 1];
}

findLongestWord("The quick brown fox jumped over the lazy dog");

























