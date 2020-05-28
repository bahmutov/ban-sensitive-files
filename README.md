# ban-sensitive-files

> Checks filenames to be committed against a library of filename rules
> to prevent storing sensitive files in Git.
> Checks some files for sensitive contents (for example authToken inside .npmrc file)

[![NPM][ban-sensitive-files-icon] ][ban-sensitive-files-url]

[![Build status][ban-sensitive-files-ci-image] ][ban-sensitive-files-ci-url]
[![dependencies][ban-sensitive-files-dependencies-image] ][ban-sensitive-files-dependencies-url]
[![devdependencies][ban-sensitive-files-devdependencies-image] ][ban-sensitive-files-devdependencies-url]

[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![alternate](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm) [![renovate-app badge][renovate-badge]][renovate-app]

Note: the source file with rules was taken from file
[git-deny-patterns.json](https://github.com/jandre/safe-commit-hook/blob/master/git-deny-patterns.json)
from repo [jandre/safe-commit-hook](https://github.com/jandre/safe-commit-hook) on Dec 2015.

## Motivation

Can you accidentally add `id_rsa` file to your Github? Sure!
But remember, it will be [very hard](https://help.github.com/articles/remove-sensitive-data/) to remove
traces of them later. [Most popular NPM packages have leaked sensitive information by mistake][1].

Wouldn't be easier to never commit files that should not be committed in the first place?
This project is a easy to use CLI or git pre-commit hook filter that will scrape modified or added
filenames to make sure they do not match widely common patterns (`.pem`, etc.)

[1]: https://github.com/ChALkeR/notes/blob/master/Do-not-underestimate-credentials-leaks.md

For example, here is `ban` in action - stopping me from adding NPM registry `_authToken` to
`.npmrc` file

[![asciicast](https://asciinema.org/a/33377.png)](https://asciinema.org/a/33377)

## Install

Add to your project `npm install --save-dev ban-sensitive-files`

## Use

* From the command line `node node_modules/.bin/ban` when you have any staged files
  to check their filenames.

* From NPM script

```json
"scripts": {
  "ban": "ban"
}
```

Then run `npm run ban` to check modified, added or deleted filenames.
You can check ALL repo filenames again by adding command line flag `-f` to form the full command
`npm run ban -- -f`.

* When using from other Git hook projects, for example from [pre-git](https://github.com/bahmutov/pre-git),
  first, add "ban" NPM script command, then add to the `pre-commit` command list

```json
"config": {
  "pre-git": {
    "pre-commit": [
      "npm test",
      "npm run ban"
    ]
  }
}
```

* When using from a CI you probably want to check all files in the repo, not just
the changed ones. Pass `-f` or `--all` option. Example Travis file

```yaml
script:
  - npm run ban -- --all
  - npm test
```

## Use as a module

You can use the checker from another module

```js
var isBanned = require('ban-sensitive-files');
isBanned('path/file/name');
// checks single file, returns true or false
// prints any errors to console.error
isBanned(['name1', 'name2', 'name3']);
// checks list of files
isBanned('file/name', logger);
// use provided logger function instead of console.error
```

## Advanced

To figure out what the script is doing, enable debug logging

    DEBUG=ban npm run ban

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/ban-sensitive-files/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[ban-sensitive-files-icon]: https://nodei.co/npm/ban-sensitive-files.svg?downloads=true
[ban-sensitive-files-url]: https://npmjs.org/package/ban-sensitive-files
[ban-sensitive-files-ci-image]: https://github.com/bahmutov/ban-sensitive-files/workflows/ci/badge.svg?branch=master
[ban-sensitive-files-ci-url]: https://github.com/bahmutov/ban-sensitive-files/actions
[ban-sensitive-files-dependencies-image]: https://david-dm.org/bahmutov/ban-sensitive-files.svg
[ban-sensitive-files-dependencies-url]: https://david-dm.org/bahmutov/ban-sensitive-files
[ban-sensitive-files-devdependencies-image]: https://david-dm.org/bahmutov/ban-sensitive-files/dev-status.svg
[ban-sensitive-files-devdependencies-url]: https://david-dm.org/bahmutov/ban-sensitive-files#info=devDependencies
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
