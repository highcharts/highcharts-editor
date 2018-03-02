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

highed.highchartsErrors = {
  // Plotting zero or subzero value on a log axis
  10: {
    title: "Can't plot zero or subzero values on a logarithmic axis",
    text:
      'This error occurs in the following situations:<ul><li>If a zero or subzero data value is added to a logarithmic axis</li><li>If the minimum of a logarithimic axis is set to 0 or less</li><li>If the threshold is set to 0 or less</li></ul>As of Highcharts 5.0.8 it is possible to bypass this error message by setting <code>Axis.prototype.allowNegativeLog</code> to<code>true</code> and add custom conversion functions. <ahref="http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/samples/highcharts/yaxis/type-log-negative/">View live demo</a>.'
  },
  // Can't link axes of different types
  11: { title: "Can't link axes of different type", text: '' },
  // series.data needs to be arrays or numbers when in turbo mode
  12: {
    title:
      'Highcharts expects point configuration to be numbers or arrays in turbo mode',
    text: ''
  },
  // Rendering div not found
  13: { title: 'Rendering div not found', text: '' },
  // Expected number, got string
  14: { title: 'String value sent to series.data, expected Number', text: '' },
  // Expected sorted data, got non-sorted
  15: {
    title: 'Highcharts expects data to be sorted',
    text:
      'The data passed to your chart needs to be sorted. If you\'re using the datagrid, you can sort your data by clicking the arrow in the x-axis column header, and selecting "Sort Ascending"'
  },
  // Highcharts already defined
  16: { title: 'Highcharts already defined in the page', text: '' },
  // Requested type doesn't exist
  17: { title: 'The requested series type does not exist', text: '' },
  // Requested axis doesn't exist
  18: {
    title: 'The requested axis does not exist',
    text:
      'Make sure that your only references existing axis in the series properties.'
  },
  // Too many ticks (use bug spray)
  19: { title: 'Too many ticks', text: '' },
  // Can't add point config to a long data series
  20: {
    title: "Can't add object point configuration to a long data series",
    text: ''
  },
  // Can't find Proj4js library
  21: { title: "Can't find Proj4js library", text: '' },
  // Map does not support lat/long
  22: { title: 'Map does not support latitude/longitude', text: '' },
  // Unsupported color format used for color
  23: {
    title: 'Unsupported color format used for color interpolation',
    text: ''
  },
  // Cannot run Point.update on a grouped point
  24: { title: 'Cannot run Point.update on a grouped point', text: '' },
  // Can't find moment.js
  25: { title: "Can't find Moment.js library", text: '' },
  // WebGL not supported
  26: {
    title: 'WebGL not supported, and no fallback module included',
    text: ''
  },
  // Browser does not support SVG
  27: { title: 'This browser does not support SVG.', text: '' }
};
