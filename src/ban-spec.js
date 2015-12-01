const la = require('lazy-ass');
const check =  require('check-more-types');

describe('ban', function () {
  const isBanned = require('./ban');

  it('catches a few cases', function () {
    const invalid = ['id_rsa', '.bash_history'];
    invalid.forEach(function (name) {
      la(isBanned(name), name);
    });
  });

  it('allows other filenames', function () {
    const invalid = ['something', 'foo.js'];
    invalid.forEach(function (name) {
      la(!isBanned(name), name);
    });
  });

  it('catches long paths', function () {
    la(isBanned('foo/bar/id_rsa'));
  });

  it('allows other long paths', function () {
    la(!isBanned('foo/bar/Gruntfile.js'));
  });
});
