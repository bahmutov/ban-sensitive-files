const la = require('lazy-ass')
const check = require('check-more-types')

/* global describe, it */
describe('rule to tester transform', function () {
  const toTester = require('./rule-to-tester')

  it('is a function', function () {
    la(check.fn(toTester))
  })

  describe('extension rule', function () {
    const rule = {
      part: 'extension',
      type: 'match',
      pattern: 'pem',
      caption: 'Potential cryptographic private key',
      description: null
    }

    it('validates extension', function () {
      const tester = toTester(rule)
      la(tester('something.pem'))
    })

    it('validates extension in full paths', function () {
      const tester = toTester(rule)
      la(tester('foo/bar/something.pem'))
    })

    it('allows non exact strings', function () {
      const tester = toTester(rule)
      la(!tester('something.pema'))
    })

    it('allows substring', function () {
      const tester = toTester(rule)
      la(!tester('something-pem.js'))
    })
  })

  describe('path rule', function () {
    const rule = {
      part: 'path',
      type: 'regex',
      pattern: '\\A\\.?gem/credentials\\z',
      caption: 'Rubygems credentials file'
    }

    it('validates in the middle', function () {
      const tester = toTester(rule)
      la(tester('.gem/credentials'), 'with dot')
      la(tester('gem/credentials'), 'without dot')
    })
  })

  describe('filename rule', function () {
    const rule = {
      part: 'filename',
      type: 'regex',
      pattern: '\\A.*_rsa\\z',
      caption: 'Private SSH key',
      description: null
    }

    it('makes a function from a rule', function () {
      const tester = toTester(rule)
      la(check.fn(tester))
    })

    it('validates filename', function () {
      const tester = toTester(rule)
      la(tester('id_rsa'))
    })

    it('passes other strings', function () {
      const tester = toTester(rule)
      la(!tester('something'))
    })
  })
})
