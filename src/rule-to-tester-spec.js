var la = require('lazy-ass');
var check =  require('check-more-types');

describe('rule to tester transform', function () {
  var toTester = require('./rule-to-tester');

  it('is a function', function () {
    la(check.fn(toTester));
  });

  const rule = {
    "part": "filename",
    "type": "regex",
    "pattern": "\\A.*_rsa\\z",
    "caption": "Private SSH key",
    "description": null
  };

  it('makes a function from a rule', function () {
    const tester = toTester(rule);
    la(check.fn(tester));
  });

  it('validates filename', function () {
    const tester = toTester(rule);
    la(tester('id_rsa'));
  });

  it('passes other strings', function () {
    const tester = toTester(rule);
    la(!tester('something'));
  });
});
