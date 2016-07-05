'use strict';

require('mocha');
var assert = require('assert');
var exists = require('./');
var isLinux = process.platform === 'linux';

describe('fs-exists-sync', function() {
  it('should export a function', function() {
    assert.equal(typeof exists, 'function');
  });

  it('should be truthy a file exists', function() {
    assert(exists('README.md'));
    assert(exists('LICENSE'));
  });

  it('should not be case sensitive', function() {
    assert(exists('readme.md'));
    assert(exists('license'));
  });

  it('should return filepath when a file exists', function() {
    assert.equal(exists('README.md'), 'README.md');
    assert.equal(exists('LICENSE'), 'LICENSE');
  });

  it('should handle case sensitive names on linux', function() {
    assert.equal(exists('readme.md'), (isLinux ? 'README.md' : 'readme.md'));
    assert.equal(exists('license'), (isLinux ? 'LICENSE' : 'license'));
  });

  it('should return true when a file exists', function() {
    assert(exists('.'));
    assert(exists('fixtures'));
    assert(exists(process.cwd()));
  });

  it('should return false when a file does not exist', function() {
    assert(!exists());
    assert(!exists(''));
    assert(!exists('foofofo'));
    assert(!exists('foofofo.txt'));
  });

  it('should return false when a directory does not exist', function() {
    assert(!exists('lib/'));
    assert(!exists('whatever/'));
  });
});
