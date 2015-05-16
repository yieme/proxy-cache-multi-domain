'use strict';

var proxyCacheMultiDomain = require('./')
var urls = '/cdnjs:1140@2.0/.min.css,16pixels@0.1.5/.min.css'

process.on('uncaughtException', function (err) {
	console.log('uncaughtExemption:', err)
	console.log('stack:', err.stack)
})

proxyCacheMultiDomain({url: urls}, function(err, data) {
	if (err) throw err
	console.log('headers:', data.headers)
	console.log('body:',    data.body)
})
