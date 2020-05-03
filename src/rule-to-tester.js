const la = require('lazy-ass')
const check = require('check-more-types')
const toR = require('./re-to-regexp')

const ruleSchema = {
  part: check.unemptyString,
  type: check.unemptyString,
  pattern: check.unemptyString
}
const isRuleSchema = check.schema.bind(null, ruleSchema)
const path = require('path')

function I (x) { return x }

function extension (filename) {
  // remove leading dot
  return path.extname(filename).substr(1)
}

const fileParts = {
  filename: path.basename,
  extension,
  path: I
}

const regRules = {
  regex: function (pattern) {
    const reg = toR(pattern)
    return function (str) {
      return reg.test(str)
    }
  },
  match: function (pattern) {
    return function (str) {
      return str === pattern
    }
  }
}

function ruleToTester (rule) {
  la(isRuleSchema(rule), 'invalid rule', rule)
  const getFilePart = fileParts[rule.part] || fileParts.filename

  const getRegex = regRules[rule.type] || regRules.regex
  const getRegexFull = getRegex(rule.pattern)

  return function testRule (str) {
    const part = getFilePart(str)
    return getRegexFull(part)
  }
}

module.exports = ruleToTester
