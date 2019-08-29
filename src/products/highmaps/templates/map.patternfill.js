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

highed.templates.add('Map', {
  title: 'Pattern Fill',
  description: [
    '',
  ],
  thumbnail: 'mappatternfill.svg',
  dataValidator: false,
  constructor: 'Map',
  config: {
    chart: {
      
    },
    // Limit zoom
    xAxis: {
        minRange: 3500
    },

    // We do not want a legend
    legend: {
        enabled: false
    },

    // Make tooltip show full image
    tooltip: {
        useHTML: true,
        borderColor: '#aaa',
        headerFormat: '<b>{point.point.name}</b><br>',
        pointFormat: '<img style="width: 150px; height: 100px;" src=\'{point.options.color.pattern.image}\'>'
    }
  }
});
