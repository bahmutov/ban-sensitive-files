const la = require('lazy-ass')
const check = require('check-more-types')
const rules = require('../git-deny-patterns.json')
la(check.array(rules), 'missing list of rules', rules)
const ruleToTester = require('./rule-to-tester')
la(check.fn(ruleToTester), 'could not get rule to tester')

const log = require('debug')('ban')

log('loaded', rules.length, 'rules')

// TODO lift?
function formTesters (rules) {
  return rules.map(function (rule) {
    return ruleToTester(rule)
  })
}

const testers = formTesters(rules)

function singleTester (filenames, logger, tester, k) {
  return filenames.some(function (filename) {
    if (tester(filename)) {
      const brokenRule = rules[k]

      let message = 'invalid filename ' + filename
      if (check.unemptyString(brokenRule.caption)) {
        message += '\n - ' + brokenRule.caption
      }
      if (brokenRule.description) {
        message += '\n - ' + brokenRule.description
      }
      logger(message)

      return true
    }

    return false
  })
}

function isBannedFilename (filename, logger) {
  la(check.maybe.unemptyString(filename) ||
    check.array(filename), 'expected single or list of filenames', filename)
  logger = logger || console.error.bind(console)

  const filenames = check.array(filename) ? filename : [filename]

  return testers.some(singleTester.bind(null, filenames, logger))
}

module.exports = isBannedFilename
