const collectFiles = require('./collect-files')
const leaveSensitive = require('./sensitive-files')
const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')
const Promise = require('bluebird')
const path = require('path')
const log = require('debug')('ban')
const read = require('fs').readFileSync
la(is.fn(read), 'missing read file')

const pluralize = require('pluralize')

function print (files) {
  la(is.array(files), 'expected list of files', files)
  console.log('found %d sensitive %s',
    files.length, pluralize('file', files.length))
  console.log(files.join('\n'))
}

const checkNpmrc = require('./check-npmrc-file')
const nameToCheck = {
  '.npmrc': checkNpmrc
}

function checkForFile (filename) {
  la(is.unemptyString(filename), 'expected filename', filename)
  const name = path.basename(filename)
  const check = nameToCheck[name]
  la(is.fn(check), 'not a check function for', name, check)

  function readFile () {
    return Promise.resolve(read(filename, 'utf-8'))
  }

  if (is.fn(check)) {
    log('checking file', filename)
    return check(readFile)
  }
}

function findLeakedData (files) {
  return Promise.map(files, checkForFile, { concurrency: 1 })
    .then(R.filter(is.unemptyString))
}

function checkSensitiveFiles (options) {
  let start
  if (is.array(options)) {
    log('assuming got array of filenames to check for leaked data')
    start = Promise.resolve(options)
  } else {
    start = collectFiles(options)
  }
  return start
    .then(leaveSensitive)
    .then(R.tap(print))
    .then(findLeakedData)
}

module.exports = checkSensitiveFiles

// how to convert to point free style this check?
// .then(list => la(is.array(list)))
if (!module.parent) {
  checkSensitiveFiles({ all: true })
    .then(R.tap(list => la(is.array(list))))
    .catch(console.error.bind(console))
}
