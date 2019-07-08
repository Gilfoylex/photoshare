'use strict'

const Fs = require('fs');

var utils = {};

utils.readFileAsync = (fpath, encoding) => {
  return new Promise((resolve, reject) => {
    Fs.readFile(fpath, encoding, (err, content) => {
      if (err)
      {
        reject(err);
      }
      else
      {
        resolve(content);
      }
    });
  });
}

module.exports = utils;