/*

Highcharts Editor

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

*/

highed.templates.addCategory('Area', {
});
highed.templates.addCategory('Bar', {
});
highed.templates.addCategory('Line', {
  description: [
    'A line chart is a type of chart which diplays information as a series of data points called "markers" connected by straight line segments'
  ],

  samples: ['os-stats', 'line-series-simple', 'line-series-four-series']
});

highed.templates.addCategory('Pie', {
  description: [
    'A pie chart is a circular statistical graphic which is divided into slices to illustrate numerical proportions.',
    'In a pie chart, the arc length of each slice is proportional to the quantity it represents.'
  ],

  samples: ['pie-series-simple']
});

highed.templates.addCategory('Bar', {
  description: [
    'A bar chart is a chart that presents grouped data with rectangular bars with lengths proportional to the values that they represent.'
  ],

  nofits: 'The dataset must contain at least one column.',

  samples: []
});

highed.templates.addCategory('Column', {
  description: [],

  samples: []
});

highed.templates.addCategory('Stock', {
});

highed.templates.addCategory('Scatter And Bubble', {
});

highed.templates.addCategory('Polar', {
});

highed.templates.addCategory('More', {
});