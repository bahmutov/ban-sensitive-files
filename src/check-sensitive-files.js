const collectFiles = require('./collect-files')
const isSensitive = require('./sensitive-files')
const R = require('ramda')
const la = require('lazy-ass')
const is = require('check-more-types')

function checkSensitiveFiles (options) {
  return collectFiles(options)
    .then(R.filter(isSensitive))
    .then(R.tap(R.bind(console.log, console)))
}

module.exports = checkSensitiveFiles

// how to convert to point free style this check?
// .then(list => la(is.array(list)))
if (!module.parent) {
  checkSensitiveFiles({ all: true })
    .then(list => la(is.array(list)))
    .catch(console.error.bind(console))
}
