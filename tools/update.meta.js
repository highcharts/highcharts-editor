/******************************************************************************

Copyright (c) 2016, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

/*  Take a fresh API dump and update the meta dictionary.
    
    This will override options as such:
        tooltipText: set if no text is defined in the meta already
        dataType: always set
        context: always set
        defaults: always set
        parent: always set
*/

var meta = require(__dirname + '/../dictionaries/meta.js'),
    api = {},
    apiSorted = {},
    fs = require('fs'),
    async = require('async'),
    license = fs.readFileSync(__dirname + '/../LICENSE'),
    request = require('request'),
    apiDumpURL = 'http://api.highcharts.com/highcharts/option/dump.json'
;

require('colors');

function isArray(what) {
    return what !== null && typeof what !== 'undefined' && what.constructor.toString().indexOf("Array") > -1;
}

function sortAPI() {
    api.forEach(function (entry) {
        apiSorted[entry.name] = entry;
    });
}

function update(entry) {
    var aentry;

    if (isArray(entry)) {
        entry.forEach(update);
    } else if (isArray(entry.options)) {
        entry.options.forEach(function (option) {
            update(option);
        });
    } else if (typeof entry.options !== 'undefined') {
        Object.keys(entry.options).forEach(function (key) {
            update(entry.options[key]);
        });
    } else if (typeof entry.id !== 'undefined') {
        if (typeof apiSorted[entry.id] !== 'undefined') {
            aentry = apiSorted[entry.id];
            entry.dataType = (aentry.returnType || '').toLowerCase();
            entry.context = aentry.context || 'General';
            entry.tooltipText = entry.tooltipText || aentry.description;
            entry.defaults = aentry.defaults;
            entry.parent = aentry.parent;
            entry.values = aentry.values;
        } else {    
            console.log('[warn]'.yellow, 'Unknown property:', entry.id, 'skipping...');
        }
    }
}

function process() {
    sortAPI();
    update(meta);

    fs.writeFile(__dirname + '/../dictionaries/test.js', '/*\n' + license + '\n*/\n\nhighed.meta.optionsExtended = ' + JSON.stringify(meta, undefined, '  ') + ';', function (err) {
        if (err) {
            console.log('[error]'.red, err);
        }
    });
}

console.log('Higcharts Editor Meta Updater'.green);
console.log('Fetching latest API dump...'.bold);

request(apiDumpURL, function (error, response, body) {
    console.log('API Fetched, transforming...'.bold);
    if (error) {
        console.log('[error]'.red, error);
    } else {
        try {
            api = JSON.parse(body);
            process();
        } catch (e) {
            console.log('[error]'.red, e);
        }
    }
});
