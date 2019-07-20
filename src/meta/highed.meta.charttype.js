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
        'low': {
            'name': "Low",
            'desc': 'The low or minimum value for each data point.',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'linkedTo': 'low',
            'rawValue': [1]
        }, 
        'values': null,
        'high': {
            'name': "High",
            'desc': 'The high or maximum value for each data point.',
            'default': 'C',
            'value': 'C',
            'isData': true,
            'mandatory': true,
            'linkedTo': 'high',
            'rawValue': [2]
        }
    },
    boxplot: {
        'low': {
            'name': "Low",
            'desc': 'The low value for each data point, signifying the lowest value in the sample set. The bottom whisker is drawn here.',
            'default': 'B',
            'value': 'B',
            'isData': true,
            'mandatory': true,
            'linkedTo': 'low',
            'rawValue': [1]
        }, 
        'values': null,
        'high': {
            'name': "High",
            'desc': 'The rank for this points data label in case of collision. If two data labels are about to overlap, only the one with the highest labelrank will be drawn.',
            'default': 'C',
            'value': 'C',
            'isData': true,
            'mandatory': true,
            'linkedTo': 'high',
            'rawValue': [2]
        }, 
        'median': {
            'name': "Median",
            'desc': 'The median for each data point. This is drawn as a line through the middle area of the box.',
            'default': 'D',
            'value': 'D',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'median',
            'rawValue': [3]
        }, 
        'q1': {
            'name': "Q1",
            'desc': 'The lower quartile for each data point. This is the bottom of the box.',
            'default': 'E',
            'value': 'E',
            'mandatory': true,
            'multipleValues': false,
            'isData': true,
            'previousValue': null,
            'linkedTo': 'q1',
            'rawValue': [4]
        }, 
        'q3': {
            'name': "Q3",
            'desc': 'The higher quartile for each data point. This is the top of the box.',
            'default': 'F',
            'value': 'F',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'q3',
            'rawValue': [4]
        }
    },
    candlestick: {
        'values': null,
        'close': {
            'name': "Close",
            'desc': 'The closing value of each data point.',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'linkedTo': 'close',
            'isData': true,
            'rawValue': [1]
        }, 
        'open': {
            'name': "Open",
            'desc': 'The opening value of each data point.',
            'default': 'C',
            'value': 'C',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'open',
            'rawValue': [2]
        }, 
        'low': {
            'name': "Low",
            'desc': 'The low or minimum value for each data point.',
            'default': 'D',
            'value': 'D',
            'multipleValues': false,
            'previousValue': null,
            'mandatory': true,
            'isData': true,
            'linkedTo': 'low',
            'rawValue': [3]
        }, 
        'high': {
            'name': "High",
            'desc': 'The high or maximum value for each data point.',
            'default': 'E',
            'value': 'E',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'high',
            'rawValue': [4]
        }
    },
    bubble: {
        'values': null,
        'y': {
            'name': "Y",
            'desc': 'Y Position',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'y',
            'rawValue': [1]
        },
        'z': {
            'name': "Z",
            'desc': 'Z Position.',
            'default': 'C',
            'value': 'C',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'z',
            'rawValue': [2]
        }
    },
    columnrange: {
        'values': null,
        'low': {
            'name': "Low",
            'desc': 'The low or minimum value for each data point.',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'low',
            'rawValue': [1]
        },
        'high': {
            'name': "High",
            'desc': 'The high or maximum value for each data point.',
            'default': 'C',
            'value': 'C',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'high',
            'rawValue': [2]
        }
    },
    tilemap: {
        'values': null,
        'labels': null,
        'country_code': {
            'name': "Country Code",
            'desc': 'The country code',
            'default': 'A',
            'value': 'A',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'hc-a2',
            'rawValue': [0]
        },
        'name': {
            'name': "Name",
            'desc': 'Name',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'name',
            'rawValue': [1]
        },
        'region': {
            'name': "Region",
            'desc': 'Region',
            'default': 'C',
            'value': 'C',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'region',
            'rawValue': [2]
        },
        'x': {
            'name': "X Value",
            'desc': 'X Value',
            'default': 'D',
            'value': 'D',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'x',
            'rawValue': [3]
        },
        'y': {
            'name': "Y Value",
            'desc': 'Y Value',
            'default': 'E',
            'value': 'E',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'y',
            'rawValue': [4]
        },
        'value': {
            'name': "Value",
            'desc': 'The value of the country',
            'default': 'F',
            'value': 'F',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'value',
            'rawValue': [5]
        }
    },
    map: {
        'values': null,
        'labels': null,
        'index': {
            'name': "Index",
            'desc': 'Index',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'x',
            'rawValue': [1]
        },
        'country_code': {
            'name': "Country Code",
            'desc': 'The country code',
            'default': 'A',
            'value': 'A',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'hc-key',
            'rawValue': [0]
        },
        'value': {
            'name': "Value",
            'desc': 'The value of the country',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'value',
            'rawValue': [1]
        }

    },
    mapbubble: {
        'values': null,
        'labels': null,
        'index': {
            'name': "Index",
            'desc': 'Index',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'x',
            'rawValue': [1]
        },
        'country_code': {
            'name': "Country Code",
            'desc': 'The country code',
            'default': 'A',
            'value': 'A',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'hc-key',
            'rawValue': [0]
        },
        'value': {
            'name': "Value",
            'desc': 'The value of the country',
            'default': 'B',
            'value': 'B',
            'mandatory': true,
            'isData': true,
            'linkedTo': 'z',
            'rawValue': [1]
        }

    }
};
