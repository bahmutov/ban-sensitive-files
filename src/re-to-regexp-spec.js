var la = require('lazy-ass');
var check =  require('check-more-types');

describe('re to regexp', function () {
  const toR = require('./re-to-regexp');

  it('is a function', function () {
    la(check.fn(toR));
  });

  it('works with simple rule', function () {
    const rule = {
      "part": "filename",
      "type": "regex",
      "pattern": "\\A.*_rsa\\z",
      "caption": "Private SSH key",
      "description": null
    };
    const reg = toR(rule.pattern);
    la(check.object(reg),
      'returns regexp', typeof reg, reg);
    la(reg.test('id_rsa'), 'matches id_rsa');
  });

  it('works with another rule', function () {
    const rule = {
      "part": "filename",
      "type": "regex",
      "pattern": "\\A\\.?(bash_|zsh_|z)?history\\z",
      "caption": "Shell command history file",
      "description": null
    };
    const reg = toR(rule.pattern);
    la(reg.test('.bash_history'));
    la(reg.test('.zsh_history'));
    la(reg.test('.zhistory'));
  });
});
