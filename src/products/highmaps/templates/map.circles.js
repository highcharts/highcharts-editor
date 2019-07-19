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
  title: 'Tilemap Circle',
  description: [
    '',
  ],
  thumbnail: 'mapcircle.svg',
  dataValidator: false,
  constructor: 'Map',
  config: {
    chart: {
      type: 'tilemap',
      inverted: true,
      height: '80%'
    },


    xAxis: {
      visible: false
    },

    yAxis: {
        visible: false
    },

    colorAxis: {
      dataClasses: [{
          to: 2,
          color: '#e8f5e9',
          name: 'Weak'
      }, {
          from: 2,
          to: 5,
          color: '#81c784',
          name: 'Average'
      }, {
          from: 5,
          to: 6,
          color: '#43a047',
          name: 'Strong'
      }, {
          from: 6,
          color: '#1b5e20',
          name: 'Stellar'
      }]
    },

    plotOptions: {
      series: {
          tileShape: 'circle',
          dataLabels: {
              enabled: true,
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
