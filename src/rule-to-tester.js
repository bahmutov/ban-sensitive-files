const la = require('lazy-ass');
const check =  require('check-more-types');
const toR = require('./re-to-regexp');

const ruleSchema = {
  part: check.unemptyString,
  type: check.unemptyString,
  pattern: check.unemptyString
};
const isRuleSchema = check.schema.bind(null, ruleSchema);
const path = require('path');

function I(x) { return x; }

const fileParts = {
  filename: path.basename,
  extension: path.extname,
  path: I
};

function ruleToTester(rule) {
  la(isRuleSchema(rule), 'invalid rule', rule);
  const reg = toR(rule.pattern);
  const getFilePart = fileParts[rule.part] || fileParts.filename;

  return function testRule(str) {
    const part = getFilePart(str);
    return reg.test(part);
  };
}

module.exports = ruleToTester;
