/*eslint quotes: [0] */

var chai = require('chai')
chai.use(require('chai-as-promised'))
var should = chai.should()

var z		= require('zaccaria-cli')
var promise = z.$b
var fs		= z.$fs
var $s = require('shelljs')

/**
 * Promised version of shelljs exec
 * @param  {string} cmd The command to be executed
 * @return {promise}     A promise for the command output
 */
function exec(cmd) {
  "use strict"
  return new promise((resolve, reject) => {
    require('shelljs').exec(cmd, {
      async: true,
      silent: true
    }, (code, output) => {
      if (code !== 0) {
        reject(output)
      } else {
        resolve(output)
      }
    })
  })
}

/*global describe, it, before, beforeEach, after, afterEach */

describe('#command', () => {
  "use strict"
  it('should show help', () => {
    var usage = fs.readFileSync(`${__dirname}/../docs/usage.md`, 'utf8')
    return exec(`${__dirname}/../index.js -h`).should.eventually.contain(usage)
  })
    it('should convert a small file', () => {
        var tv = $s.cat(`${__dirname}/../test/small.json`)
      return exec(`${__dirname}/../index.js convert ${__dirname}/../test/small.bib`).should.eventually.contain(tv)
  })
})
