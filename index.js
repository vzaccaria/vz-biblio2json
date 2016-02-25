#!/usr/bin/env node
"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/* eslint quotes: [0], strict: [0] */

var _require = require("zaccaria-cli");

var $d = _require.$d;
var $o = _require.$o;
var $f = _require.$f;
var $s = _require.$s;
var _ = _require._;
var $b = _require.$b;
var $fs = _require.$fs;

var et = require("easy-table");
var hash = require("string-hash");
var chalk = require("chalk");
var postProcessJson = require("./lib/postJson");
var debug = require("debug")(__filename);

function warning(m) {
    var warning = chalk.yellow.underline;
    console.log(warning("warning: ") + m);
}

function message(m) {
    var warning = chalk.blue.underline;
    console.log(warning("info: ") + m);
}

function error(m) {
    var warning = chalk.red.underline;
    console.log(warning("error: ") + m);
}

function ok(m) {
    var warning = chalk.green.underline;
    console.log(warning("ok: ") + m);
}

var getOptions = function (doc) {
    "use strict";
    var o = $d(doc);
    var help = $o("-h", "--help", false, o);
    var bibfile = o["<file>"];
    var bib1 = o["<file1>"];
    var bib2 = o["<file2>"];
    var convert = o.convert;
    var summary = o.summary;
    var check = o.check;
    var adjust = false;
    var adjustfile;
    if (!_.isNull(o["--adjust"])) {
        adjust = true;
        adjustfile = o["--adjust"];
    }
    return {
        help: help, convert: convert, bibfile: bibfile, summary: summary, bib1: bib1, bib2: bib2, check: check, adjust: adjust, adjustfile: adjustfile
    };
};

function info(r) {
    var s = _.pick(r, ["title", "booktitle"]);
    s.title = _.trunc(s.title);
    s.booktitle = _.trunc(s.booktitle);
    return s;
}

function getInfo(it, fn) {
    var fields = ["title", "booktitle", "pages", "year", "uniqueId", "hash"];
    it = _.pick(it, fields);
    it.title = _.trunc(it.title, 100);
    it.booktitle = _.trunc(it.booktitle, 50);
    it.filename = require("path").basename(fn);
    return it;
}

function compare(x1, x2) {
    var arr = [x1, x2];
    arr = _.map(arr, getInfo);
    console.log(et.print(arr));
}

function diff(j1, j2, filename1) {
    var notfound = [];
    var justfound = [];
    _.forEach(j1, function (r1) {
        var found = false;
        _.forEach(j2, function (r2) {
            if (r1.title === r2.title) {
                if (r1.pages !== r2.pages || r1.uniqueId !== r2.uniqueId || r1.year !== r2.year) {
                    warning("these could be equal " + r1.hash + " to " + r2.hash);
                    compare(r1, r2);
                } else {
                    justfound.push(getInfo(r1, filename1));
                    found = true;
                }
            } else {
                if (!_.isUndefined(r1.uniqueId) && !_.isUndefined(r2.uniqueId) && r1.uniqueId === r2.uniqueId) {
                    console.log("");
                    warning("These have the same DOI but will be treated as different");
                    warning(" * [" + r1.hash + "] " + _.trunc(r1.title) + " (" + r1.year + ", pages: " + r1.pages + ")");
                    warning("   book: " + r1.booktitle);
                    warning(" * [" + r2.hash + "] " + _.trunc(r2.title) + " (" + r2.year + ", pages: " + r2.pages + ")");
                    warning("   book: " + r2.booktitle);
                }
            }
        });
        if (!found) {
            notfound.push(getInfo(r1, filename1));
        }
    });
    return notfound;
}

function normalize(json) {
    return _.map(json, function (it) {
        it.hash = hash(JSON.stringify(it));
        it.title = it.title.toLowerCase();
        it.title = it.title.replace("run-time", "runtime");
        it.title = it.title.replace("multi-core", "multicore");
        it.title = it.title.replace("design-space", "design space");
        if (!_.isUndefined(it.identifier) && it.identifier[0].type === "doi") {
            it.uniqueId = "doi:" + it.identifier[0].id;
            return it;
        } else {
            return it;
        }
    });
}

var internalRules = [{
    name: "minor",
    rule: function (it) {
        var kw = ["minor", "techreport", "talk", "forum", "application", "thesis"];
        return _.any(_.map(kw, function (k) {
            return _.contains(it.keyword, k);
        }));
    }
}];

function applyRules(rules, json) {
    _.map(rules.verified, function (it) {
        json = _.filter(json, function (j) {
            if (j.hash === it.hash1 || j.hash == it.hash2) {
                message("Excluding pair [" + j.hash + "] '" + _.trunc(j.title) + "' beacuse of existing rule [" + it.hash1 + "] ~ [" + it.hash2 + "] - " + it.notes);
                return false;
            } else {
                if (_.any(internalRules, function (r) {
                    return r.rule(j);
                })) {
                    message("an internal rule matches. removing [" + j.hash + "] '" + _.trunc(j.title) + "'");
                    return false;
                } else return true;
            }
        });
    });
    return json;
}

var _require2 = require("mdtable2json");

var getTables = _require2.getTables;

function getRules(filename) {
    return $fs.readFileAsync(filename, "utf8").then(function (it) {
        return {
            verified: _.map(getTables(it)[0].json, function (r) {
                r.hash1 = parseInt(r.hash1);
                r.hash2 = parseInt(r.hash2);
                return r;
            })
        };
    });
}

var main = function () {
    $f.readLocal("docs/usage.md").then(function (it) {
        var options = getOptions(it);
        var help = options.help;
        var convert = options.convert;
        var bibfile = options.bibfile;
        var summary = options.summary;
        var bib1 = options.bib1;
        var bib2 = options.bib2;
        var check = options.check;
        var adjust = options.adjust;
        var adjustfile = options.adjustfile;

        if (help) {
            console.log(it);
        } else {
            if (convert || summary) {
                var cmd = "" + __dirname + "/tools/bibjson.py " + bibfile;
                debug("executing '" + cmd + "'");
                $s.execAsync(cmd, {
                    silent: true,
                    async: true
                }).then(function (it) {
                    it = it[0];
                    debug(it);
                    debug("got " + it);
                    it = JSON.parse(it);
                    if (convert) {
                        it.records = postProcessJson(it.records);
                        console.log(JSON.stringify(it, 0, 4));
                    } else {
                        console.log(et.print(_.map(it.records, function (p) {
                            return {
                                year: p.year,
                                pages: p.pages,
                                title: p.title,
                                id: p.identifier
                            };
                        })));
                    }
                });
            } else {
                if (check) {
                    var promises = [$s.execAsync("" + __dirname + "/tools/bibjson.py " + bib1, {
                        silent: true
                    }), $s.execAsync("" + __dirname + "/tools/bibjson.py " + bib2, {
                        silent: true
                    })];

                    $b.all(promises).then(function (_ref) {
                        var _ref2 = _slicedToArray(_ref, 2);

                        var b1 = _ref2[0];
                        var b2 = _ref2[1];

                        b1 = normalize(JSON.parse(b1).records);
                        b2 = normalize(JSON.parse(b2).records);
                        if (adjust) {
                            getRules(adjustfile).then(function (rules) {
                                b1 = applyRules(rules, b1);
                                b2 = applyRules(rules, b2);
                                var nf = diff(b1, b2, bib1);
                                nf = nf.concat(diff(b2, b1, bib2));
                                nf = _.sortBy(nf, "title");
                                if (nf.length > 0) {
                                    error("some records were not found");
                                    console.log(et.print(nf));
                                } else {
                                    ok("all records found or covered by rules");
                                }
                            });
                        } else {
                            var nf = diff(b1, b2, bib1);
                            nf = nf.concat(diff(b2, b1, bib2));
                            nf = _.sortBy(nf, "title");
                            error("not found");
                            console.log(et.print(nf));
                        }
                    });
                }
            }
        }
    });
};

main();
