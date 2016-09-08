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

const templates = require(__dirname + '/../src/meta/highed.meta.charts.js');
const request = require('request');
const async = require('async');
const fs = require('fs');
const mkdir = require('mkdirp');

const output =  [
    'app/dependencies/'
];

const cdnScripts = [
    "https://code.highcharts.com/stock/highstock.js",
    "https://code.highcharts.com/adapters/standalone-framework.js",
    "https://code.highcharts.com/highcharts-more.js",
    "https://code.highcharts.com/highcharts-3d.js",
    "https://code.highcharts.com/modules/data.js",
    "https://code.highcharts.com/modules/exporting.js",
    "https://code.highcharts.com/modules/funnel.js",
    "https://code.highcharts.com/modules/solid-gauge.js"
];

require('colors');

console.log('Updating dependencies from CDN'.green);

cdnScripts.forEach(function (script) {
    request(script, function (error, response, body) {
        if (error) return console.log('[error fetching script]', error);

        output.forEach(function (out) {
            mkdir(out, function (error) {
                if (error) return console.log('[error creating output folder]'.red, error);
                fs.writeFile(out + script.substr(script.lastIndexOf('/')), body, function (err) {
                    if (error) return console.log('[error writing script]'.red, error);
                });
            });
        });
    });
});
