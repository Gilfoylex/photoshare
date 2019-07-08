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

utils.getAlldataAsync = (msgType)=> {
  return new Promise ((resolve, reject) => {
    console.log(msgType);
    resolve({"allkeys": [1,2,3,4,5,6]});
  });
}

module.exports = utils;