const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('sensitive filenames', () => {
  const isSensitive = require('./sensitive-files')
  it('is a function', () => {
    la(is.fn(isSensitive), 'missing check fn')
  })

  it('accepts empty list', () => {
    const result = isSensitive([])
    la(is.array(result))
    la(is.empty(result))
  })

  it('accepts empty string', () => {
    const result = isSensitive('')
    la(is.array(result))
    la(is.empty(result))
  })

  it('detects .npmrc filename', () => {
    const filename = '.npmrc'
    const result = isSensitive(filename)
    la(result[0] === '.npmrc')
  })

  it('detects .npmrc filename in subfolder', () => {
    const filename = 'foo/bar/baz/.npmrc'
    const result = isSensitive(filename)
    la(result[0] === filename)
  })

  it('detects .npmrc among several files', () => {
    const filename = 'foo/bar/baz/.npmrc'
    const result = isSensitive([
      'foo', 'bar.txt', filename
    ])
    la(result.length === 1, 'single sensitive file')
    la(result[0] === filename)
  })
})
