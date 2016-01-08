const la = require('lazy-ass')
const is = require('check-more-types')
const path = require('path')

function isSensitive (filename) {
  const name = path.basename(filename)
  return name === '.npmrc'
}

// returns filenames for files with potentially
// sensitive information inside
function isFileSensitive (filenames) {
  if (is.string(filenames)) {
    filenames = [filenames]
  }
  la(is.arrayOf(is.string, filenames), 'missing filenames', filenames)
  return filenames
    .filter(is.defined)
    .filter(isSensitive)
}

module.exports = isFileSensitive
