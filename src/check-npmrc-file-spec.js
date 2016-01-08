const la = require('lazy-ass')
const is = require('check-more-types')

const promise = x => () => Promise.resolve(x)

/* global describe, it */
describe('check npmrc file', () => {
  const check = require('./check-npmrc-file')
  it('is a function', () => {
    la(is.fn(check), 'missing check fn')
  })

  it('accepts empty file', () => {
    return check(promise(''))
  })

  it('does not allow simple authToken value', () => {
    const text = '_auth="AAABBBTOKENSECRET="'
    return check(promise(text))
      .then(() => la(false, 'did not catch _auth'),
        err => {
          la(is.instance(err, Error), 'expected an Error instance')
          return Promise.resolve()
        })
  })
})
