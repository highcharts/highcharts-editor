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

const fs = require('fs');
const hb = require('handlebars');
const mkdir = require('mkdirp');
const enOutPath = __dirname + '/../src/';
const reference = require(__dirname + '/../localization/en.json');
const outPath = __dirname + '/../dist/languagepacks/';
const template = hb.compile(
    fs.readFileSync(
        __dirname + '/../templates/localization.handlebars', 
        'utf8'
    )
);

require('colors');

mkdir(outPath, function () {
    fs.readdir(__dirname + '/../localization/', function (err, files) {
        if (err) {

            return console.log(
                '[localization generator] error loading localizations:'.red, 
                err
            );
        }

        files.forEach(function (file) {
            if (file.indexOf('.json') === file.length - 5) {
                
                fs.readFile(__dirname + '/../localization/' + file, function (err, d) {
                    if (err) {
                        return console.log(
                            '[localization generator] error loading localizations:'.red, 
                            err
                        );
                    }

                    var language = file.replace('.json', ''),
                        languageJSON = JSON.parse(d.toString()),
                        t = template({
                            filename: file,
                            date: new Date(),
                            language: language,
                            translations: JSON.stringify(                                
                                languageJSON, 
                                undefined, 
                                '  '
                            ).replace(/\n/g, '\n    ')
                        })
                    ;

                    //Check with reference 
                    Object.keys(reference).forEach(function (k) {
                        if (typeof languageJSON[k] === 'undefined') {
                            console.log(
                                '[localization generator] warning'.yellow,
                                'localization missing for',
                                k,
                                'in', 
                                '"' + language + '"',
                                'translation',
                                'this entry will fall back to english'
                            );
                        }
                    });

                    function afterWrite(err) {
                        if (err) {
                            return console.log(
                                '[localization generator] error writing localization:'.red, 
                                err
                            );
                        }

                        console.log(
                            '[localization generator]'.cyan, 
                            '"' + language + '"', 
                            'translation generated'
                        );                            
                    }

                    if (language === 'en') {
                        fs.writeFile(enOutPath + 'en.js', t, afterWrite);                        
                    } else {
                        fs.writeFile(
                            outPath + 'highcharts.editor.lang.' + language + '.js', 
                            t, 
                            afterWrite
                        );                        
                    }
                });
            }
        });
    });
});