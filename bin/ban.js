#!/usr/bin/env node --harmony

require('update-notifier')({
  pkg: require('../package.json')
}).notify()

const log = require('debug')('ban')
const la = require('lazy-ass')
const is = require('check-more-types')
const collectFiles = require('../src/collect-files')

function shouldCheckAllFiles () {
  return process.argv.some(str => {
    return str === 'all' ||
      str === 'every' ||
      str === '-f' ||
      str === '--force'
  })
}

const isBanned = require('..')
const options = {
  all: shouldCheckAllFiles()
}

collectFiles(options)
  .then(isBanned)
  .then(function (foundBannedFilenames) {
    if (foundBannedFilenames) {
      log('found banned filenames', foundBannedFilenames)
      la(is.array(foundBannedFilenames), 'expected list', foundBannedFilenames)
      la(is.not.empty(foundBannedFilenames), 'empty list', foundBannedFilenames)
      process.exit(-1)
    }
    log('found no banned filenames')
  })
  .catch(function (err) {
    console.error(err.message)
    process.exit(-1)
  })
  .done()
