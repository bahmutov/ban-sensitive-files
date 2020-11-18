const la = require('lazy-ass')
const check = require('check-more-types')

/* global describe, it */
describe('ban', function () {
  const isBanned = require('./ban')

  it('is a function', function () {
    la(check.fn(isBanned))
  })

  it('catches a few cases', function () {
    const invalid = ['id_rsa', '.bash_history']
    invalid.forEach(function (name) {
      la(isBanned(name), name)
    })
  })

  it('allows other filenames', function () {
    const invalid = ['something', 'foo.js']
    invalid.forEach(function (name) {
      la(!isBanned(name), name)
    })
  })

  it('catches long paths', function () {
    la(isBanned('foo/bar/id_rsa'))
  })

  it('allows other long paths', function () {
    la(!isBanned('foo/bar/Gruntfile.js'))
  })

  it('catches pem extension', function () {
    const name = 'something.pem'
    la(isBanned(name), 'pem extension should be banned', name)
  })

  it('allows pem substring', function () {
    const name = 'something-pem.txt'
    la(!isBanned(name), 'should be allowed', name)
  })

  it('catches tblk extension', function () {
    la(isBanned('foo.tblk'))
    la(!isBanned('foo.atblk'))
  })

  it('calls provided logger', function () {
    let called = 0
    function logger () {
      called += 1
    }
    la(isBanned('foo.tblk', logger))
    la(called === 1, 'logger has been called once')
  })

  it('supports multiple filename', function () {
    let called = 0
    function logger () {
      called += 1
    }
    const filenames = ['foo.tblk', 'id_rsa']
    la(isBanned(filenames, logger))
    la(called === 1, 'logger has been called once')
  })

  it('passes multiple filename', function () {
    let called = 0
    function logger () {
      called += 1
    }
    const filenames = ['foo.js', 'bar/baz.js']
    la(!isBanned(filenames, logger))
    la(called === 0, 'no problems')
  })
})
