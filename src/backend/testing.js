
var _data

export class Testing {
	constructor() {

	}

	static get data() { return _data || {} }
	static set data(d) { _data = d }

}