/******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

// @format

highed.meta.assignDefaults = {
    'labels': {
      'name': "Categories",
      'desc': 'Choose a column for the category types. Can be names or a date.',
      'default': 'A',
      'value': 'A',
      'rawValue': [0],
      'previousValue': null,
      'linkedTo': 'x',
      'isLabel': true,
      'mandatory': true,
      'colors': {
        'light': 'rgb(217, 244, 242)',
        'dark': 'rgb(66, 200, 192)',
      }
    },
    'values': {
      'name': "Values",
      'desc': 'Enter column with the values you want to chart.',
      'default': 'B',
      'linkedTo': 'y',
      'isData': true,
      'value': 'B',
      'rawValue': [1],
      'previousValue': null,
      'mandatory': true,
      'colors': {
        'light': 'rgb(233,234,250)',
        'dark': 'rgb(145, 151, 229)',
      }
    },
    'label': {
      'name': "Label",
      'desc': 'The name of the point as shown in the legend, tooltip, data label etc.',
      'default': '',
      'value': '',
      'rawValue': null,
      'previousValue': null,
      'mandatory': false,
      'linkedTo': 'label',        
      'colors': {
        'light': 'rgb(250,233,233)',
        'dark': 'rgb(229, 145, 145)',
      },
      'noNulls': true
    }
  };