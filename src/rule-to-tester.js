var la = require('lazy-ass');
var check =  require('check-more-types');
const toR = require('./re-to-regexp');

var ruleSchema = {
  type: check.unemptyString,
  pattern: check.unemptyString
};
var isRuleSchema = check.schema.bind(null, ruleSchema);

function ruleToTester(rule) {
  la(isRuleSchema(rule), 'invalid rule', rule);
  var reg = toR(rule.pattern);
  return function testRule(str) {
    return reg.test(str);
  };
}

module.exports = ruleToTester;
