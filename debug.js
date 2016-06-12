import prettyjson from 'prettyjson'
import colors from 'colors'

//logging
var options = {
  noColor: false,
  keysColor: 'yellow'
}

global.log = (data, message) => {
    data = data || '[NOTHING]'
    message = message || ''
    if (message) { console.log(message) }

    try {
        console.log(prettyjson.render(data, options))
    } catch (err) {
        console.log('!!!!!!!!!!!!PRETTYJSON FAILED!!!!!!!!!!!!!!')
        console.log('err: ', err)
        // console.log('data: ', data)
    }
}


//tracing
global.t = global.t = function () {
    var modules = (new Error).stack.split('\n');

    var stack = []

    for (var i = 2; i < modules.length; i++) {
        var x = modules[i].split('(')
        x = x[x.length - 1]
        x = x.split('/')
        x = x[x.length - 1].trim().replace(')', '')
        stack.push(x)

        if (i > 6) {
            break;
        }
    }

    var m = '===> stack trace: ' + stack.join(' | ')
    console.log(m.yellow)

    if (arguments.length > 0) {
        log.apply(this, arguments)
    }

}


