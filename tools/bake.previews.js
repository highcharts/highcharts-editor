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
const output = 'src/meta/highed.meta.images.js';
const fs = require('fs');
const license = fs.readFileSync(__dirname + '/../LICENSE').toString();
const logoPath = __dirname + '/../res/logo.svg';

require('colors');

var funs = [],
    images = {
        'logo.svg': fs.readFileSync(logoPath).toString();
    }
;

console.log('Highcharts Editor Image Baker'.green);

Object.keys(templates).forEach(function (cat) {
    Object.keys(templates[cat].templates).forEach(function (key) {
        var template = templates[cat].templates[key];

        funs.push(function (next) {
            request(template.urlImg, function (error, response, body) {
                if (!error) {
                    console.log('Baking', template.urlImg.bold);
                    images[template.urlImg] = body;
                } else {
                    console.log('[error]'.red, error);
                }
                next(error);
            });
        });
    });
});

async.waterfall(funs, function () {
    var res = '/*\n' + license + '\n*/\n\nhighed.meta.images = ' + JSON.stringify(images, undefined, '  ') + ';';
    fs.writeFile(__dirname + '/../' + output, res, function (err) {
        if (err) return console.log('[error]'.red, err);
        console.log('All done. Stored at', output);
    });
});