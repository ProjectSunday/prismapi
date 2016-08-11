import { ObjectID } from 'mongodb'

import DB from './db'
import { Category } from '~/backend/backend'

export class RequestedClass {
	constructor(context) {
		this.context = context
		return this
	}


	

	async create (newClass) {
		newClass.interested = [ this.context.user.get() ]
		newClass.category = this.context.category.get()
		var requested = await DB.Create('requestedclasses', newClass)
		Object.assign(this, requested)
	}
	async read(filter) {
		var requested = await DB.Read('requestedclasses', filter)
		Object.assign(this, requested)
	}
	async update(filter) {
		var requested = Object.assign({}, this)
		delete requested.context
		requested = await DB.Update('requestedclasses', filter, requested)
		Object.assign(this, requested)
	}
	async delete(filter) {
		await this.read(filter)
		var requested = await DB.Delete('requestedclasses', filter)
		Object.assign(this, requested)
	}




	async fetchAll() {
		this.context.requestedClasses = await DB.ReadMany('requestedclasses')
	}

	async addInterestedUser(args) {
		await this.read({ _id: args._id })

		var u = this.context.user
		this.interested.push( this.context.user.get() )

		this.update({ _id: args._id })
	}

	async removeInterestedUser(args) {
		await this.read({ _id: args._id })

		var removeIndex = this.interested.findIndex(u => u._id.equals(this.context.user._id))
		if (removeIndex === -1) throw `Unable to find interested user (_id: ${this.context.user._id}) to remove from requested class (_id: ${this._id}).`
		this.interested.splice(removeIndex, 1)

		this.update({ _id: args._id })
	}

}