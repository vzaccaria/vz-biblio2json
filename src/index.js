/* eslint quotes: [0], strict: [0] */
var {
    $d, $o, $f, $s, _, $b, $fs
} = require('zaccaria-cli')

var et = require('easy-table')
var hash = require('string-hash')
var chalk = require('chalk')

function warning(m) {
    var warning = chalk.yellow.underline
    console.log(warning('warning: ') + m)
}

function message(m) {
    var warning = chalk.blue.underline
    console.log(warning('info: ') + m)
}

function error(m) {
    var warning = chalk.red.underline
    console.log(warning('error: ') + m)
}

function ok(m) {
    var warning = chalk.green.underline
    console.log(warning('ok: ') + m)
}


var getOptions = doc => {
    "use strict"
    var o = $d(doc)
    var help = $o('-h', '--help', false, o)
    var bibfile = o['<file>']
    var bib1 = o['<file1>']
    var bib2 = o['<file2>']
    var convert = o.convert
    var summary = o.summary
    var check = o.check
    var adjust = false
    var adjustfile
    if (!_.isNull(o['--adjust'])) {
        adjust = true
        adjustfile = o['--adjust']
    }
    return {
        help, convert, bibfile, summary, bib1, bib2, check, adjust, adjustfile
    }
}

function info(r) {
    var s = _.pick(r, ['title', 'booktitle'])
    s.title = _.trunc(s.title)
    s.booktitle = _.trunc(s.booktitle)
    return s
}

function getInfo(it, fn) {
    var fields = ['title', 'booktitle', 'pages', 'year', 'uniqueId', 'hash']
    it = _.pick(it, fields)
    it.title = _.trunc(it.title, 100)
    it.booktitle = _.trunc(it.booktitle, 50)
    it.filename = require('path').basename(fn)
    return it
}

function compare(x1, x2) {
    var arr = [x1, x2]
    arr = _.map(arr, getInfo)
    console.log(et.print(arr))
}

function diff(j1, j2, filename1) {
    var notfound = []
    var justfound = []
    _.forEach(j1, (r1) => {
        var found = false
        _.forEach(j2, (r2) => {
            if (r1.title === r2.title) {
                if (r1.pages !== r2.pages || r1.uniqueId !== r2.uniqueId || r1.year !== r2.year) {
                    warning(`these could be equal ${r1.hash} to ${r2.hash}`)
                    compare(r1, r2)
                } else {
                    justfound.push(getInfo(r1, filename1))
                    found = true
                }
            } else {
                if (!_.isUndefined(r1.uniqueId) && !_.isUndefined(r2.uniqueId) &&
                    r1.uniqueId === r2.uniqueId) {
                    console.log('')
                    warning(`These have the same DOI but will be treated as different`)
                    warning(` * [${r1.hash}] ${_.trunc(r1.title)} (${r1.year}, pages: ${r1.pages})`)
                    warning(`   book: ${r1.booktitle}`)
                    warning(` * [${r2.hash}] ${_.trunc(r2.title)} (${r2.year}, pages: ${r2.pages})`)
                    warning(`   book: ${r2.booktitle}`)
                }
            }
        })
        if (!found) {
            notfound.push(getInfo(r1, filename1))
        }
    })
    return notfound
}

function normalize(json) {
    return _.map(json, (it) => {
        it.hash = hash(JSON.stringify(it))
        it.title = it.title.toLowerCase()
        it.title = it.title.replace('run-time', 'runtime')
        it.title = it.title.replace('multi-core', 'multicore')
        it.title = it.title.replace('design-space', 'design space')
        if (!_.isUndefined(it.identifier) && it.identifier[0].type === 'doi') {
            it.uniqueId = `doi:${it.identifier[0].id}`
            return it
        } else {
            return it
        }
    })
}

var internalRules = [{
    name: 'minor',
    rule: (it) => {
        var kw = ['minor', 'techreport', 'talk', 'forum', 'application', 'thesis' ]
        return _.any(_.map(kw, (k) => _.contains(it.keyword, k)))
    }
}]

function applyRules(rules, json) {
    _.map(rules.verified, (it) => {
        json = _.filter(json, (j) => {
            if (j.hash === it.hash1 || j.hash == it.hash2) {
                message(`Excluding pair [${j.hash}] '${_.trunc(j.title)}' beacuse of existing rule [${it.hash1}] ~ [${it.hash2}] - ${it.notes}`)
                return false
            } else {
                if (_.any(internalRules, (r) => r.rule(j))) {
                    message(`an internal rule matches. removing [${j.hash}] '${_.trunc(j.title)}'`)
                    return false
                } else return true
            }
        })
    })
    return json
}

var {
    getTables
} = require('mdtable2json')

function getRules(filename) {
    return $fs.readFileAsync(filename, 'utf8').then((it) => {
        return {
            verified: _.map(getTables(it)[0].json, (r) => {
                r.hash1 = parseInt(r.hash1)
                r.hash2 = parseInt(r.hash2)
                return r
            })
        }
    })
}

var main = () => {
    $f.readLocal('docs/usage.md').then(it => {
        var options = getOptions(it)
        var {
            help, convert, bibfile, summary, bib1, bib2, check, adjust, adjustfile
        } = options;
        if (help) {
            console.log(it)
        } else {
            if (convert || summary) {
                $s.execAsync(`${__dirname}/tools/bibjson.py ${bibfile}`, {
                    silent: true
                }).then((it) => {
                    it = JSON.parse(it)
                    if (convert) {
                        console.log(JSON.stringify(it, 0, 4));
                    } else {
                        console.log(et.print(
                            _.map(it.records, (p) => {
                                return {
                                    year: p.year,
                                    pages: p.pages,
                                    title: p.title,
                                    id: p.identifier
                                }
                            })))
                    }
                })
            } else {
                if (check) {
                    var promises = [$s.execAsync(`${__dirname}/tools/bibjson.py ${bib1}`, {
                        silent: true
                    }), $s.execAsync(`${__dirname}/tools/bibjson.py ${bib2}`, {
                        silent: true
                    })]

                    $b.all(promises).then(([b1, b2]) => {
                        b1 = normalize(JSON.parse(b1).records)
                        b2 = normalize(JSON.parse(b2).records)
                        if (adjust) {
                            getRules(adjustfile).then((rules) => {
                                b1 = applyRules(rules, b1)
                                b2 = applyRules(rules, b2)
                                var nf = diff(b1, b2, bib1)
                                nf = nf.concat(diff(b2, b1, bib2))
                                nf = _.sortBy(nf, 'title')
                                if(nf.length > 0) {
                                    error('some records were not found')
                                    console.log(et.print(nf))
                                } else {
                                    ok('all records found or covered by rules')
                                }
                            })
                        } else {
                            var nf = diff(b1, b2, bib1)
                            nf = nf.concat(diff(b2, b1, bib2))
                            nf = _.sortBy(nf, 'title')
                            error('not found')
                            console.log(et.print(nf))

                        }
                    })
                }
            }
        }
    })
}

main()
