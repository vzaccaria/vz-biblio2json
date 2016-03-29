/*eslint quotes: [0] */

let chai = require('chai')
chai.use(require('chai-as-promised'))
let should = chai.should()

let z = require('zaccaria-cli')
let promise = z.$b
let fs = z.$fs
let $s = require('shelljs')
let _ = z._

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

function removeTimestamp(t) {
    _.map(t.records, (i) => {
        i.timestamp = 0
    })
    return t
}

/*global describe, it, before, beforeEach, after, afterEach */

describe('#command', () => {
    "use strict"
    it('should show help', () => {
        let usage = fs.readFileSync(`${__dirname}/../docs/usage.md`, 'utf8')
        return exec(`${__dirname}/../index.js -h`).should.eventually.contain(usage)
    })
    it('should convert a small file', () => {
        let tv = JSON.parse($s.cat(`${__dirname}/../test/small.json`));
        tv = removeTimestamp(tv)
        return exec(`${__dirname}/../index.js convert ${__dirname}/../test/small.bib`).then(JSON.parse).then(removeTimestamp).should.eventually.deep.equal(tv)
    })
    it('should convert a big file', () => {
        let tv = JSON.parse($s.cat(`${__dirname}/../test/big.json`));
        tv = removeTimestamp(tv)
        return exec(`${__dirname}/../index.js convert ${__dirname}/../test/big.bib`).then(JSON.parse).then(removeTimestamp).should.eventually.deep.equal(tv)
    })
})
