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

highed.meta.charttype = {
    arearange: {
        "data": [{
                'id': 'low',
                'name': "Low",
                'desc': 'The low or minimum value for each data point.',
                'default': 'B',
                'value': 'B',
                'mandatory': true,
                'linkedTo': 'low',
                'rawValue': [1]
            }, {
                'id': 'high',
                'name': "High",
                'desc': 'The high or maximum value for each data point.',
                'default': 'C',
                'value': 'C',
                'mandatory': true,
                'linkedTo': 'high',
                'rawValue': [2]
            }
        ]
    },
    boxplot: {
        "data": [{
                'id': 'low',
                'name': "Low",
                'desc': 'The low value for each data point, signifying the lowest value in the sample set. The bottom whisker is drawn here.',
                'default': 'B',
                'value': 'B',
                'mandatory': true,
                'linkedTo': 'low',
                'rawValue': [1]
            }, {
                'id': 'high',
                'name': "High",
                'desc': 'The rank for this points data label in case of collision. If two data labels are about to overlap, only the one with the highest labelrank will be drawn.',
                'default': 'C',
                'value': 'C',
                'mandatory': true,
                'linkedTo': 'high',
                'rawValue': [2]
            }, {
                'id': 'median',
                'name': "Median",
                'desc': 'The median for each data point. This is drawn as a line through the middle area of the box.',
                'default': 'D',
                'value': 'D',
                'mandatory': true,
                'linkedTo': 'median',
                'rawValue': [3]
            }, {
                'id': 'q1',
                'name': "Q1",
                'desc': 'The lower quartile for each data point. This is the bottom of the box.',
                'default': '',
                'value': '',
                'multipleValues': false,
                'previousValue': null,
                'linkedTo': 'q1',
            }, {
                'id': 'q3',
                'name': "Q3",
                'desc': 'The higher quartile for each data point. This is the top of the box.',
                'default': '',
                'value': '',
                'linkedTo': 'q3'
            }
        ]
    },
    candlestick: {
        "data": [{
                'id': 'close',
                'name': "Close",
                'desc': 'The closing value of each data point.',
                'default': 'B',
                'value': 'B',
                'mandatory': true,
                'linkedTo': 'close',
                'rawValue': [1]
            }, {
                'id': 'open',
                'name': "Open",
                'desc': 'The opening value of each data point.',
                'default': 'C',
                'value': 'C',
                'mandatory': true,
                'linkedTo': 'open',
                'rawValue': [2]
            }, {
                'id': 'low',
                'name': "Low",
                'desc': 'The low or minimum value for each data point.',
                'default': 'D',
                'value': 'D',
                'multipleValues': false,
                'previousValue': null,
                'mandatory': true,
                'linkedTo': 'low',
                'rawValue': [3]
            }, {
                'id': 'high',
                'name': "High",
                'desc': 'The high or maximum value for each data point.',
                'default': 'E',
                'value': 'E',
                'mandatory': true,
                'linkedTo': 'high',
                'rawValue': [4]
            }]
    }
};
