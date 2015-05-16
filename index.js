/** Proxy Cache for Multiple Domains
 *
 *  @copyright  Copyright (C) 2015 by Yieme
 *  @module     proxy-cache-multi-domain
 */

  'use strict';
  var _                   = require('lodash')
  var proxyCacheMultiFile = require('proxy-cache-multi-file')
  var options             = {
    dir: "./tmp",
    defaultDomain: 'cdnjs',
    domain: {
      cdnjs:      'https://cdnjs.cloudflare.com/ajax/libs/$package/$version/$file',
      jsdelivr:   'https://cdn.jsdelivr.net/$package/$version/$file',
      google:     'https://ajax.googleapis.com/ajax/libs/$package/$version/$file',
      bootstrap:  'https://maxcdn.bootstrapcdn.com/bootstrap/$package/$file',
      bootswatch: 'https://maxcdn.bootstrapcdn.com/bootswatch/$version/$package/$file',
    }
}

function buildFileList(urls, errorCallback) {
  var domain   = options.defaultDomain
  var template = options.domain[domain]
  var files    = []
  var groups   = urls.split(',')
  for (var i=0, len=groups.length; i < len; i++) {
    var group = groups[i]
    var slash = group.indexOf('/')
    if (slash < 0) return errorCallback('invalid package / filename')
    var part = group.substr(0, slash).split('@')
    var fileset = group.substr(slash+1, group.length - slash -1).split('+')
    var version = part[1]
    var part2   = part[0].split(':')
    var packag  = part[0]
    if (part2[1]) {
      domain   = part2[0]
      packag  = part2[1]
    }
    if (!version) version = ''
    var lowerPackage = packag.toLowerCase()
//    console.log('domain:', domain, '- packag', packag, '- version', version)
    template = options.domain[domain]
    if (!template) return errorCallback('invalid package domain: ' + domain)
    for (var f=0, len2 = fileset.length; f < len2; f++) {
      var file = fileset[f]
      if (file.substr(0,1) == '.') {
        if (domain == 'bootswatch') {
          file = 'bootstrap' + file
        } else {
          file = packag + file
        }
      }
      if (file.substr(0,1) == '/') file = file.substr(1, file.length-1)
      file = template.replace('$package', lowerPackage).replace('$version', version).replace('$file', file)
      files.push(file)
    }
  }
  return files
}



function proxyCacheMultiDomain(req, callback) {
  if (!callback) {
    options = _.extend(options, req)
    proxyCacheMultiFile(options)
    return proxyCacheMultiDomain
  }

  var urls = req.url.substr(1,req.url.length-1) // drop leading slash /
  urls = buildFileList(urls, callback)
  if (!urls) callback(new Error('Missing URL'))
  proxyCacheMultiFile(urls, callback)
}



module.exports = proxyCacheMultiDomain
