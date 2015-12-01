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

  it('catches pem extension', function () {
    const name = 'something.pem';
    la(isBanned(name), 'pem extension should be banned', name);
  });

  it('allows pem substring', function () {
    const name = 'something-pem.txt';
    la(!isBanned(name), 'should be allowed', name);
  });

  it('catches tblk extension', function () {
    la(isBanned('foo.tblk'));
    la(!isBanned('foo.atblk'));
  });
});
