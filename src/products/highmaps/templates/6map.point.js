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
  title: 'Point Map',
  description: [
    'Point Maps can be used to show the distribution of data over a geographical region, by placing equally sized markers over the region.',
  ],
  thumbnail: 'mappoint.svg',
  dataValidator: false,
  loadForEachSeries: false,
  constructor: 'Map',
  load: function(chart, event) {
    //Create serie if chart only has one
    if (chart.series && chart.series.length <= 1) {

      event.emit('ChangeAssignDataType', 'map', {
        "joinBy": 0
      });

      event.emit('AddDefaultSeries');

    }
  },
  config: {
    chart: {
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
          verticalAlign: 'bottom'
      }
    },

    xAxis: {
      visible: false
    },

    plotOptions: {
      series: {
        fillColor: 'black'
      }
    },

    yAxis: {
      visible: false
    },

    legend: {
      enabled: false
    },
    tooltip: {
      enabled: false
    },

    series: [{
        joinBy: 'hc-key',
        type: 'mappoint',
    }]
  }
});
