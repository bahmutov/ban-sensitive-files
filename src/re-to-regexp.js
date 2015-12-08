// based on the differences between Python re and JavaScript
// http://www.regular-expressions.info/javascript.html
// maybe some features are available in XRegExp?
// http://www.regular-expressions.info/xregexp.html
function pythonToJavaScriptRegularExpression (pattern) {
  console.assert(typeof pattern === 'string', 'invalid pattern', pattern)
  const jsPattern = pattern
    .replace('\\A', '^')
    .replace('\\z', '$')
  return new RegExp(jsPattern)
}

module.exports = pythonToJavaScriptRegularExpression
