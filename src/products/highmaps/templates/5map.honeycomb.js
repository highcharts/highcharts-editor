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
  title: 'Honeycomb',
  description: [
    'Tilemaps are maps where each area is represented by tiles of equal shape. You can choose from circle or honeycomb which uses hexagonal tiles.',
  ],
  thumbnail: 'maphoneycomb.svg',
  dataValidator: false,
  constructor: 'Map',
  config: {
    chart: {
      type: 'tilemap'
    },


    xAxis: {
      visible: false
    },

    yAxis: {
      visible: false
    },

    colorAxis: {
      dataClasses: [{
          from: 0,
          to: 1000000,
          color: '#F9EDB3',
          name: '< 1M'
      }, {
          from: 1000000,
          to: 5000000,
          color: '#FFC428',
          name: '1M - 5M'
      }, {
          from: 5000000,
          to: 20000000,
          color: '#FF7987',
          name: '5M - 20M'
      }, {
          from: 20000000,
          color: '#FF2371',
          name: '> 20M'
      }]
    },

    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.hc-a2}',
          color: '#000000',
          style: {
            textOutline: false
          }
        }
      }
    },

    legend: {
      layout: 'horizontal',
      verticalAlign: 'bottom'
    }
  }
});
