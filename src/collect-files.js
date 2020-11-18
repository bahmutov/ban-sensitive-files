const la = require('lazy-ass')
const is = require('check-more-types')
const log = require('debug')('ban')
const ggit = require('ggit')
const R = require('ramda')
const fs = require('fs')

const getName = R.prop('name')

function isFile (filename) {
  if (fs.existsSync(filename)) {
    return fs.lstatSync(filename).isFile()
  }
  // assume non-existent or deleted files could be files
  return true
}

function collectFilenamesInGitRepo (info) {
  let filenames = []
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
  return ggit.trackedFiles(process.cwd(), '**', { dot: true })
    .then(names => names.filter(isFile))
}

function collectFiles (options) {
  options = options || {}
  const start = options.all
    ? findAllRepoFiles()
    : ggit.changedFiles().then(collectFilenamesInGitRepo)
  return start.then(printFilenames)
}

module.exports = collectFiles

if (!module.parent) {
  collectFiles({ all: true })
    .then(R.tap(list => la(is.array(list))))
    .then(console.log.bind(console))
    .catch(console.error.bind(console))
}
