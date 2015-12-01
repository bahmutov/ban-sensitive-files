var rules = require('./git-deny-patterns.json');
console.log('loaded', Object.keys(rules).length, 'rules');

var sampleRule = {
  "part": "filename",
  "type": "regex",
  "pattern": "\\A.*_rsa\\z",
  "caption": "Private SSH key",
  "description": null
};

function pythonToJavaScriptRegularExpression(pattern) {
  return pattern
    .replace('\\A', '^')
    .replace('\\z', '$');
}

var fixedPattern = pythonToJavaScriptRegularExpression(sampleRule.pattern);
console.log('sample pattern', fixedPattern);

var sampleRegex = new RegExp(fixedPattern);
console.assert(sampleRegex.test('id_rsa'));
