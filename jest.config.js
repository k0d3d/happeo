const chai = require('chai')
global.jestExpect = global.expect;
global.expect = chai.expect;

const config = {
  // rootDir: './dist'
};

module.exports = config;