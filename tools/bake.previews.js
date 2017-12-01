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

const async = require('async');
const outputFolder = __dirname + '/../generated_src/';
const output = outputFolder + 'highed.meta.images.js';
const inputFolder = __dirname + '/../thumbnails/';
const fs = require('fs');

const pkg = require(__dirname + '/../package.json');
const license = fs.readFileSync(__dirname + '/../LICENSE').toString().replace('<%= version %>', pkg.version);

const mkdir = require('mkdirp');

require('colors');

console.log('Highcharts Editor Image Baker'.green);

mkdir(outputFolder, () => {
  let ofile = [
    license,
    ''
  ];

  let fileMap = {};

  fs.readdir(inputFolder, (err, files) => {
    if (err) return console.log('Error:'.red, err);

    files.forEach((filename) => {
      if (filename.indexOf('.svg') >= 0) {
        fileMap[filename] = fs.readFileSync(inputFolder + filename, 'utf8');
      }
    });

    // Write the result
    fs.writeFile(output, ofile.concat(['highed.meta.images = ' + JSON.stringify(fileMap, false, '  ')]).join('\n'), (err) => {

    });

  });
});
