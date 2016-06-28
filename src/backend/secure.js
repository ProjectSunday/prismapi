// export function secure (token, blah, blah2) {
// 	console.log('token', token, blah, blah2)
// 	this.token = token
// }



export function secure(token) {
	// log(token, 'secure token')
   return function decorator(target) {

      target.prototype.token = token;
      // console.log('target', target)
   }
}