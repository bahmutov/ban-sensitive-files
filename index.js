const la = require('lazy-ass');
const check = require('check-more-types');
const rules = require('./git-deny-patterns.json');
la(check.array(rules), 'missing list of rules', rules);
const ruleToTester = require('./src/rule-to-tester');
la(check.fn(ruleToTester), 'could not get rule to tester');

console.log('loaded', rules.length, 'rules');

// TODO lift?
function formTesters(rules) {
  return rules.map(function (rule) {
    return ruleToTester(rule);
  });
}

var testers = formTesters(rules);

var reToRegExp = require('./src/re-to-regexp');

function isInvalidFilename(filename) {
  return testers.some(function (tester, k) {
    if (tester(filename)) {
      const brokenRule = rules[k];
      console.error('invalid filename', filename);
      console.error(brokenRule.caption);
      if (brokenRule.description) {
        console.error(' -', brokenRule.description);
      }
      return true;
    }
  });
}
