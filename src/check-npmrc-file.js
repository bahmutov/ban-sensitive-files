const la = require('lazy-ass')
const is = require('check-more-types')

function checkLine (line) {
  la(is.string(line), 'expected line string', line)
  if (line.indexOf('_auth=') !== -1) {
    return 'Found _auth token'
  }
  if (line.indexOf('_authToken=') !== -1) {
    return 'Found _authToken text'
  }
}

function checkNpmrcText (text) {
  la(is.string(text), 'expected text')
  const lines = text.split('\n')
  const errors = []
  lines.forEach(line => {
    const err = checkLine(line)
    if (err) {
      errors.push(err)
    }
  })
  if (errors.length) {
    return Promise.reject(new Error(errors.join('\n')))
  }
  return Promise.resolve()
}

function checkNpmrcFile (getFile) {
  la(is.fn(getFile), 'missing get file fn')
  return getFile()
    .then(checkNpmrcText)
}

module.exports = checkNpmrcFile
