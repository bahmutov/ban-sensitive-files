#!/usr/bin/env node --harmony

require('update-notifier')({
  pkg: require('../package.json')
}).notify()

const log = require('debug')('ban')

const fs = require('fs')

function isFile (filename) {
  if (fs.existsSync(filename)) {
    return fs.lstatSync(filename).isFile()
  }
  // assume non-existent or deleted files could be files
  return true
}

function getProperty (prop) {
  return function (obj) {
    return obj[prop]
  }
}

function shouldCheckAllFiles () {
  return process.argv.some(str => {
    return str === 'all' ||
      str === 'every' ||
      str === '-f' ||
      str === '--force'
  })
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
  log('checking %d filenames', names.length)
  log(names)
  return names
}

function findAllRepoFiles () {
  return ggit.trackedFiles(process.cwd(), '**')
    .then(names => names.filter(isFile))
}

const start = shouldCheckAllFiles()
  ? findAllRepoFiles() : ggit.changedFiles().then(collectFilenames)

start
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
