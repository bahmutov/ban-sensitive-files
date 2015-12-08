#!/usr/bin/env node --harmony

require('update-notifier')({
  pkg: require('../package.json')
}).notify()

const log = require('debug')('ban')

function getProperty (prop) {
  return function (obj) {
    return obj[prop]
  }
}

const isBanned = require('..')
const ggit = require('ggit')
const getName = getProperty('name')

function collectFilenames (info) {
  var filenames = []
  if (info.A) {
    filenames = filenames.concat(info.A.map(getName))
  }
  if (info.M) {
    filenames = filenames.concat(info.M.map(getName))
  }
  if (info.C) {
    filenames = filenames.concat(info.C.map(getName))
  }
  return filenames
}

function printFilenames (names) {
  log('%d changed filenames', names.length)
  log(names)
  return names
}

ggit.changedFiles()
  .then(collectFilenames)
  .then(printFilenames)
  .then(isBanned)
  .then(function (foundBannedFilenames) {
    log('found banned filenames?', foundBannedFilenames)
    if (foundBannedFilenames) {
      process.exit(-1)
    }
  })
  .catch(function (err) {
    console.error(err.message)
    process.exit(-1)
  })
  .done()
