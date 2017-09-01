/*!
 * fs-exists-sync (https://github.com/jonschlinkert/fs-exists-sync)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Check if the given `filepath` exists.
 *
 * ```js
 * var res = exists('package.json');
 * console.log(res);
 * //=> "package.json"
 *
 * var res = exists('fake-file.json');
 * console.log(res)
 * //=> false
 * ```
 *
 * @name exists
 * @param  {String} `filepath` filepath to check for.
 * @return {String|Boolean} Returns the found filepath if it exists, otherwise returns `false`.
 * @api public
 */

module.exports = function(filepath) {
  if (!filepath || (typeof filepath !== 'string')) {
    return false;
  }

  try {
    (fs.accessSync || fs.statSync)(filepath);
    return filepath;
  } catch (err) {}

  if (process.platform === 'linux') {
    return exists(filepath);
  }
  return false;
};

/**
 * Check if the filepath exists by falling back to reading in the entire directory.
 * Returns the real filepath (for case sensitive file systems) if found.
 *
 * @param  {String} `filepath` filepath to check.
 * @return {String|Boolean} Returns found filepath if exists, otherwise false.
 */

function exists(filepath) {
  filepath = path.resolve(filepath);
  var res = tryReaddir(filepath);
  if (res === null) {
    return false;
  }

  // "filepath" is a directory, an error would be
  // thrown if it doesn't exist. if we're here, it exists
  if (res.path === filepath) {
    return res.path;
  }

  // "fp" is not a directory
  var lower = filepath.toLowerCase();
  var len = res.files.length;
  var idx = -1;

  while (++idx < len) {
    var fp = path.resolve(res.path, res.files[idx]);
    if (filepath === fp || lower === fp) {
      return fp;
    }
    var fpLower = fp.toLowerCase();
    if (filepath === fpLower || lower === fpLower) {
      return fp;
    }
  }

  return false;
}

/**
 * Try to read the filepath as a directory first, then fallback to the filepath's dirname.
 *
 * @param  {String} `filepath` path of the directory to read.
 * @return {Object} Object containing `path` and `files` if successful. Otherwise, null.
 */

function tryReaddir(filepath) {
  var ctx = { path: filepath, files: [] };
  try {
    ctx.files = fs.readdirSync(filepath);
    return ctx;
  } catch (err) {}
  try {
    ctx.path = path.dirname(filepath);
    ctx.files = fs.readdirSync(ctx.path);
    return ctx;
  } catch (err) {}
  return null;
}
