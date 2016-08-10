import { Category, RequestedClass, UpcomingClass, User } from '~/backend/backend'

export class Context {
	constructor() {
		this.category = new Category(this)
		this.requestedClass = new RequestedClass(this)
		this.user = new User(this)
		this.upcomingClass = new UpcomingClass(this)
	}
}