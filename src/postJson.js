let _ = require('lodash');
let $ = require('underscore.string');

// Normalization patterns.

let patt = {
    "Reghizzi": {
        name: "S. Crespi Reghizzi"
    },
    "Biagio": {
        name: "A. Di Biagio"
    }
};

let months = [
    { short: "jan" , long: "January"   } ,
    { short: "feb" , long: "February"  } ,
    { short: "mar" , long: "March"     } ,
    { short: "apr" , long: "April"     } ,
    { short: "may" , long: "May"       } ,
    { short: "jun" , long: "June"      } ,
    { short: "jul" , long: "July"      } ,
    { short: "aug" , long: "August"    } ,
    { short: "sep" , long: "September" } ,
    { short: "oct" , long: "October"   } ,
    { short: "nov" , long: "November"  } ,
    { short: "dec" , long: "December" }
];

let fix_month = function(r) {
    if(_.isUndefined(r.month)) {
        return r
    }
    let mn = _.find(months, (v, k) => {
        return $.include(r.month.toLowerCase(), v.short);
    })
    if(_.isUndefined(mn)) {
        return r
    } else {
        r.month = mn.long;
        return r
    }
};

let strip = function(s) {
    return $.words(s)[1];
};


let fix_identifier = function(r) {
    let grouped = _.groupBy(r.identifier, 'type')
    grouped = _.mapValues(grouped, (i) => {
        return _.first(i).id
    })
    if(!_.isUndefined(grouped.isbn)) {
        grouped.isbn = grouped.isbn.replace(/ISBN:?/g, "");
        grouped.isbn = grouped.isbn.replace(/ISSN:?/g, "");
        grouped.isbn = grouped.isbn.replace(/\s/g, "");
        grouped.isbn = grouped.isbn.replace(/-/g, "");
        if(grouped.isbn.length == 8) {
            grouped.issn = grouped.isbn
            delete grouped.isbn
        } else {
            if(grouped.isbn.length !== 10 && grouped.isbn.length !== 13) {
                grouped.isbn = undefined;
            }
        }

    }
    return _.assign(r, grouped);
};

function fix_type(r) {
    function tkw(k) {
        switch (k) {
            case 'bookc':
                return 'bookchapter';
            case 'journal':
                return 'journal';
            case 'book':
                return 'book';
            case 'conference':
                return 'conference';
            case 'techreport':
                return 'techreport';
            case 'workshop':
                return 'workshop';
            case 'patent':
                return 'patent';
            case 'talk':
                return 'talk';
            case 'forum':
                return 'talk';
            case 'thesis':
                return 'thesis';
            default:
                return undefined;
        }
    }

    let fkw = _.filter(_.map(r.keyword, tkw), (it) => {
        return !_.isUndefined(it);
    });
    r.type = _.first(fkw)
    r.justAccepted = _.includes(r.keyword, 'accepted')
    r.justApplied = _.includes(r.keyword, 'application')
    if(r.type === 'patent') {
        r.patentNumber = r.number
    }
    if(r.type === 'techreport') {
        r.reportNumber = r.number
    }
    return r
}

// names are either
// Last, N
// Last, Name
// Last, N.N.N.
// and should be translated into N.(N.N.) Last

function fix_author(a) {
    let name = a.name
    let components = $.words(name, ",");
    let first_name = $.capitalize($.clean(components[1]), true);
    let last_name  = $.capitalize($.clean(components[0]), true);

    if (_.isPlainObject(patt[last_name])) {
        ({name} = patt[last_name]);
    } else {
        if (first_name != null) {
            name = $.clean(`${first_name.charAt(0)}. ${last_name}`);
        }
    }

    return {
        name
    }

}

let fix_names = function(r) {
    let author = _.map(r.author, fix_author)
    r.authors = _.pluck(author, "name")
    return r;
};


let process = function(data) {
    data = _.map(data, function(d) {
        d = fix_names(d);
        d = fix_identifier(d);
        d = fix_month(d);
        d = fix_type(d);
        d.url = d["bdsk-url-1"]
        d = _.pick(d, [
            "authors", "title",
            "day", "month", "year",
            "journal", "booktitle","volume", "pages",
            "institution", "publisher", "address",
            "doi", "isbn", "issn", "url",
            "justApplied", "justAccepted", "patentNumber", "reportNumber",
            "keyword", // needed by react utils for webpage generation
            "type" // needed by markdown generation
        ]);
        return d;
    });
    //return _.sortBy(data, function(d) {
    //    return -1 * ($.toNumber(d.year));
    //});
    return data
};

module.exports = process
