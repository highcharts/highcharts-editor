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

highed.templates.add('More', {
  title: 'Solid gauge',
  description: '',
  thumbnail: 'apocob.svg',
  dataValidator: false,
  sampleSets: [],
  config: {
    chart: {
      type: 'solidgauge'
    },
    pane: {
      center: ['50%', '85%'],
      size: '140%',
      startAngle: '-90',
      endAngle: '90',
      background: {
        backgroundColor: '#EEE',
        innerRadius: '60%',
        outerRadius: '100%',
        shape: 'arc'
      }
    },
    tooltip: {
      enabled: false
    },
    yAxis: {
      stops: [[0.1, '#55BF3B'], [0.5, '#DDDF0D'], [0.9, '#DF5353']],
      min: 0,
      max: 100,
      lineWidth: 0,
      minorTickInterval: null,
      tickPixelInterval: 400,
      tickWidth: 0,
      title: {
        y: -70
      },
      labels: {
        y: 16
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 10,
          borderWidth: 0,
          useHTML: true
        }
      }
    },
    'series[0]': {
      dataLabels: {
        format:
          '<div style="text-align:center"><span style="font-size:25px;color:#000000">{y}</span></div>'
      }
    }
  }
});
