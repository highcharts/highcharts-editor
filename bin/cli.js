#!/usr/bin/env node

/*******************************************************************************

Copyright (c) 2016-2017, Highsoft

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
const mkdir = require('mkdirp');
const args = process.argv;

const options = {
  help: {
    help: [
      'Displays help information.',
      'Use help [category] to see help on specific topics, e.g. "help module"'
    ]
  },
  module: {
    help: [
      'Module functions.'
    ],
    subs: {
      init: {
        help: [
          'Scaffold a new editor module.'
        ]
      },
      build: {
        help: [
          'Build the module.',
          'The minified module ends up in the dist/ folder.'
        ]
      }
    }
  }
};

require('colors');

// Print help
function help(cat) {
  var c = options[cat] || options;

  Object.keys(c).forEach(function (key) {
    console.log(key.bold, c[key].help.join('\n');
  });
}

//Handle args
args.forEach(function (a) {
  
});



