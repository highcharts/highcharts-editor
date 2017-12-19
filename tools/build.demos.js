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


Bakes the handlebars templates into static html.
This is used to build the stuff available on
http://editor.highcharts.com

******************************************************************************/

const fs = require('fs');
const hb = require('handlebars');
const mainTemplateSrc = fs.readFileSync(__dirname + '/../views/layouts/main.handlebars');
const mainTemplate = hb.compile(mainTemplateSrc.toString());
const mkdirp = require('mkdirp');
const package = require(__dirname + '/../package.json');
const args = process.argv;
const scripts = [
    'highcharts-editor.complete.js'
];

var settings = {
    static: 'yes',
    scripts: scripts,
    package: package,
    title: 'Highcharts Editor'
};

if (args.length >= 2) {
    //Enable google analytics
    settings.analyticsToken = args[2];
    console.log('injecting google analytics', settings.analyticsToken);
}

mkdirp(__dirname + '/../demos', function () {
    fs.readdir(__dirname + '/../views', function (err, files) {
        if (err) return console.log(err);

        files.forEach(function (file) {
            var f;
            if (file.indexOf('.handlebars') >= 0) {
                fs.readFile(__dirname + '/../views/' + file, function (err, data) {
                    if (err) return console.log(err);

                    var t = hb.compile(data.toString()),
                        result = ''
                    ;

                    settings.title = 'Highcharts Editor - '+ file.replace('.handlebars', '');
                    settings.body = t(settings);
                    result = mainTemplate(settings);

                    fs.writeFile(__dirname + '/../demos/' + file.substr(0, file.lastIndexOf('.')) + '.html', result, function (err) {
                        if (err) return console.log(err);
                    });
                });
            }
        });
    });
});

