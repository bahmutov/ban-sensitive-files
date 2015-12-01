var rules = require('./git-deny-patterns.json');
console.log('loaded', Object.keys(rules).length, 'rules');

var sampleRule = {
  "part": "filename",
  "type": "regex",
  "pattern": "\\A.*_rsa\\z",
  "caption": "Private SSH key",
  "description": null
};

var sampleRule2 = {
  "part": "filename",
  "type": "regex",
  "pattern": "\\A\\.?(bash_|zsh_|z)?history\\z",
  "caption": "Shell command history file",
  "description": null
};

function pythonToJavaScriptRegularExpression(pattern) {
  return pattern
    .replace('\\A', '^')
    .replace('\\z', '$');
}

/*
var fixedPattern = pythonToJavaScriptRegularExpression(sampleRule.pattern);
console.log('sample pattern', fixedPattern);
var sampleRegex = new RegExp(fixedPattern);
console.assert(sampleRegex.test('id_rsa'));
*/

var fixedPattern = pythonToJavaScriptRegularExpression(sampleRule2.pattern);
console.log('sample pattern', fixedPattern);
var sampleRegex = new RegExp(fixedPattern);
console.assert(sampleRegex.test('.bash_history'));
console.assert(sampleRegex.test('.zsh_history'));
console.assert(sampleRegex.test('.zhistory'));
