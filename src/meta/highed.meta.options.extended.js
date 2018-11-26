/*

Highcharts Editor v<%= version %>

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

*/

// @format

highed.meta.optionsExtended = {
  options: {
    'option.cat.chart': [
      {
        text: 'option.subcat.dimension',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'chart--width',
            custom: {
              minValue: 50,
              maxValue: 5000,
              step: 10
            },
            pid: 'chart.width',
            dataType: 'number',
            context: 'General',
            defaults: 'null',
            parent: 'chart'
          },
          {
            id: 'chart--height',
            custom: {
              minValue: 50,
              maxValue: 5000,
              step: 10
            },
            pid: 'chart.height',
            dataType: 'number',
            context: 'General',
            defaults: 'null',
            parent: 'chart'
          }
        ]
      },
      {
        text: 'option.subcat.title',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'title--text',
            pid: 'title.text',
            dataType: 'string',
            context: 'General',
            defaults: 'Chart title',
            parent: 'title',
            width: 50
          },
          {
            id: 'subtitle--text',
            pid: 'subtitle.text',
            dataType: 'string',
            context: 'General',
            parent: 'subtitle',
            width: 50
          },
          {
            id: 'title--style',
            dataType: 'font',
            pid: 'title.style',
            context: 'General',
            defaults: '{ "color": "#333333", "fontSize": "18px" }',
            parent: 'title'
          },
          {
            id: 'subtitle--style',
            dataType: 'font',
            pid: 'subtitle.style',
            context: 'General',
            defaults: '{ "color": "#666666" }',
            parent: 'subtitle'
          }
        ]
      },
      {
        text: 'option.subcat.appearance',
        dropdown: true,
        options: [
          {
            header: true,
            pid: 'option.subcat.chartarea',
            width: 100,
            id: 'chartarea-header',
            dataType: 'header',
          },
          {
            id: 'chart--backgroundColor',
            pid: 'chart.backgroundColor',
            dataType: 'color',
            context: 'General',
            defaults: '#FFFFFF',
            parent: 'chart',
            width:50
          },
          {
            id: 'chart--borderColor',
            pid: 'chart.borderColor',
            dataType: 'color',
            context: 'General',
            defaults: '#335cad',
            parent: 'chart',
            width: 50
          },
          {
            id: 'chart--borderWidth',
            custom: {
              minValue: 0
            },
            pid: 'chart.borderWidth',
            dataType: 'number',
            context: 'General',
            defaults: '0',
            parent: 'chart',
            width: 50
          },
          {
            id: 'chart--borderRadius',
            custom: {
              minValue: 0
            },
            pid: 'chart.borderRadius',
            dataType: 'number',
            context: 'General',
            defaults: '0',
            parent: 'chart',
            width: 50
          }, 
          {
            header: true,
            pid: 'option.subcat.plotarea',
            width: 100,
            id: 'plotarea-header',
            dataType: 'header',
          },
          {
            id: 'chart--plotBackgroundColor',
            pid: 'chart.plotBackgroundColor',
            dataType: 'color',
            context: 'General',
            parent: 'chart',
            width: 38
          },
          {
            id: 'chart--plotBorderWidth',
            pid: 'chart.plotBorderWidth',
            dataType: 'number',
            context: 'General',
            defaults: '0',
            parent: 'chart',
            width: 31
          },
          {
            id: 'chart--plotBorderColor',
            pid: 'chart.plotBorderColor',
            dataType: 'color',
            context: 'General',
            defaults: '#cccccc',
            parent: 'chart',
            width: 31
          },
          {
            id: 'chart--plotBackgroundImage',
            pid: 'chart.plotBackgroundImage',
            dataType: 'string',
            context: 'General',
            parent: 'chart'
          },
          {
            id: 'colors',
            pid: 'colors',
            dataType: 'array<color>',
            context: 'General',
            defaults:
              '[ "#7cb5ec" , "#434348" , "#90ed7d" , "#f7a35c" , "#8085e9" , "#f15c80" , "#e4d354" , "#2b908f" , "#f45b5b" , "#91e8e1"]'
          }
        ]
      },
      {
        text: 'option.subcat.tooltip',
        dropdown: true,
        options: [          
          {
            id: 'tooltip--enabled',
            pid: 'tooltip.enabled',
            dataType: 'boolean',
            context: 'General',
            defaults: 'true',
            parent: 'tooltip',
            width: 50
          },
          {
            id: 'tooltip--shared',
            pid: 'tooltip.shared',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'tooltip',
            width: 50
          },          
          {
            id: 'tooltip--backgroundColor',
            pid: 'tooltip.backgroundColor',
            dataType: 'color',
            context: 'General',
            defaults: 'rgba(247,247,247,0.85)',
            parent: 'tooltip',
            width: 50
          },
          {
            id: 'tooltip--borderWidth',
            custom: {
              minValue: 0
            },
            pid: 'tooltip.borderWidth',
            dataType: 'number',
            context: 'General',
            defaults: '1',
            parent: 'tooltip',
            width: 50
          },
          {
            id: 'tooltip--borderRadius',
            custom: {
              minValue: 0
            },
            pid: 'tooltip.borderRadius',
            dataType: 'number',
            context: 'General',
            defaults: '3',
            parent: 'tooltip',
            width: 50
          },
          {
            id: 'tooltip--borderColor',
            pid: 'tooltip.borderColor',
            dataType: 'color',
            context: 'General',
            defaults: 'null',
            parent: 'tooltip',
            width: 50
          }
        ]
      },
      {
        text: 'option.subcat.interaction',
        dropdown: true,
        group: 2,
        options: [
          {
            id: 'chart--zoomType',
            pid: 'chart.zoomType',
            dataType: 'string',
            context: 'General',
            parent: 'chart',
            values: '[null, "x", "y", "xy"]'
          },
          {
            id: 'chart--polar',
            pid: 'chart.polar',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'chart'
          }
        ]
      },
      {
        text: 'option.subcat.credit',
        dropdown: true,
        group: 2,
        warning: [1],
        options: [
          {
            id: 'credits--enabled',
            pid: 'credits.enabled',
            dataType: 'boolean',
            context: 'General',
            defaults: 'true',
            parent: 'credits',
            warning: [1]
          },
          {
            id: 'credits--text',
            pid: 'credits.text',
            dataType: 'string',
            context: 'General',
            defaults: 'Highcharts.com',
            parent: 'credits',
            warning: [1]
          },
          {
            id: 'credits--href',
            pid: 'credits.href',
            dataType: 'string',
            context: 'General',
            defaults: 'http://www.highcharts.com',
            parent: 'credits',
            warning: [1]
          }
        ]
      }
    ],
    'option.cat.axes': [
      {
        text: 'option.subcat.xaxis',
        dropdown: true,
        options: [          
        {
          id: 'xAxis-title--style',
          dataType: 'font',
          dataIndex: 0,
          pid: 'xAxis.title.style',
          context: 'General',
          defaults: '{ "color": "#666666" }',
          parent: 'xAxis-title'
        },
        {
          id: 'xAxis-title--text',
          dataIndex: 0,
          pid: 'xAxis.title.text',
          dataType: 'string',
          context: 'General',
          parent: 'xAxis-title',
          width: 50
        },
        {
          id: 'xAxis-labels--format',
          dataIndex: 0,
          pid: 'xAxis.labels.format',
          dataType: 'string',
          context: 'General',
          defaults: '{value}',
          parent: 'xAxis-labels',
          width: 50
        },
        {
          id: 'xAxis--type',
          dataIndex: 0,
          pid: 'xAxis.type',
          dataType: 'string',
          context: 'General',
          defaults: 'linear',
          parent: 'xAxis',
          values: '["linear", "logarithmic", "datetime", "category"]'
        },
        {
          id: 'xAxis--opposite',
          dataIndex: 0,
          pid: 'xAxis.opposite',
          dataType: 'boolean',
          context: 'General',
          defaults: 'false',
          parent: 'xAxis',
          width: 50
        },
        {
          id: 'xAxis--reversed',
          dataIndex: 0,
          pid: 'xAxis.reversed',
          dataType: 'boolean',
          context: 'General',
          defaults: 'false',
          parent: 'xAxis',
          width: 50
        }

        ]
      },
      {
        text: 'option.subcat.yaxis',
        dropdown: true,
        options: [          
          {
            id: 'yAxis-title--style',
            dataType: 'font',
            dataIndex: 0,
            pid: 'yAxis.title.style',
            context: 'General',
            defaults: '{ "color": "#666666" }',
            parent: 'yAxis-title'
          },
          {
            id: 'yAxis-title--text',
            dataIndex: 0,
            pid: 'yAxis.title.text',
            dataType: 'string',
            context: 'General',
            defaults: 'Values',
            parent: 'yAxis-title',
            width: 50
          },
          {
            id: 'yAxis--type',
            dataIndex: 0,
            pid: 'yAxis.type',
            dataType: 'string',
            context: 'General',
            defaults: 'linear',
            parent: 'yAxis',
            values: '["linear", "logarithmic", "datetime", "category"]',
            width: 50
          },
          {
            id: 'yAxis-labels--format',
            dataIndex: 0,
            pid: 'yAxis.labels.format',
            dataType: 'string',
            context: 'General',
            defaults: '{value}',
            parent: 'yAxis-labels',
            width: 100
          },
          {
            id: 'yAxis--opposite',
            dataIndex: 0,
            pid: 'yAxis.opposite',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'yAxis',
            width: 50
          },
          {
            id: 'yAxis--reversed',
            dataIndex: 0,
            pid: 'yAxis.reversed',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'yAxis',
            width: 50
          }
        ]
      }
    ],
    'option.cat.series': [
      {
        id: 'series',
        array: true,
        text: 'option.cat.series',
        controlledBy: {
          title: 'Select Series',
          options: 'series',
          optionsTitle: 'name'
        },
        filteredBy: 'series--type',
        options: [
          {
            id: 'series--type',
            pid: 'series.type',
            dataType: 'string',
            context: 'General',
            parent: 'series<treemap>',
            values:
              '[null, "line", "spline", "column", "area", "areaspline", "pie", "arearange", "areasplinerange", "boxplot", "bubble", "columnrange", "errorbar", "funnel", "gauge", "scatter", "waterfall"]',
            subType: [
              'treemap',
              'scatter',
              'line',
              'gauge',
              'heatmap',
              'spline',
              'funnel',
              'areaspline',
              'area',
              'bar',
              'bubble',
              'areasplinerange',
              'boxplot',
              'pie',
              'arearange',
              'column',
              'waterfall',
              'columnrange',
              'pyramid',
              'polygon',
              'solidgauge',
              'errorbar'
            ],
            subTypeDefaults: {},
            width: 50
          },

          {
            id: 'series--dashStyle',
            pid: 'series.dashStyle',
            dataType: 'string',
            context: 'General',
            defaults: 'Solid',
            parent: 'series<areasplinerange>',
            values:
              '["Solid", "ShortDash", "ShortDot", "ShortDashDot", "ShortDashDotDot", "Dot", "Dash" ,"LongDash", "DashDot", "LongDashDot", "LongDashDotDot"]',
            subType: [
              'areasplinerange',
              'polygon',
              'areaspline',
              'spline',
              'scatter',
              'area',
              'bubble',
              'arearange',
              'waterfall',
              'line'
            ],
            subTypeDefaults: {
              polygon: 'Solid',
              areaspline: 'Solid',
              spline: 'Solid',
              scatter: 'Solid',
              area: 'Solid',
              bubble: 'Solid',
              arearange: 'Solid',
              waterfall: 'Dot',
              line: 'Solid'
            },
            width: 50
          },
          {
            id: 'series--color',
            pid: 'series.color',
            dataType: 'color',
            context: 'General',
            defaults: 'null',
            parent: 'series<boxplot>',
            subType: [
              'boxplot',
              'column',
              'waterfall',
              'columnrange',
              'heatmap',
              'area',
              'scatter',
              'bar',
              'treemap',
              'arearange',
              'bubble',
              'errorbar',
              'spline',
              'polygon',
              'line',
              'gauge',
              'areaspline',
              'areasplinerange'
            ],
            subTypeDefaults: {
              heatmap: 'null',
              treemap: 'null',
              errorbar: '#000000'
            },
            width: 18
          },
          {
            id: 'series--negativeColor',
            pid: 'series.negativeColor',
            dataType: 'color',
            context: 'General',
            defaults: 'null',
            parent: 'series<gauge>',
            subType: [
              'gauge',
              'arearange',
              'areasplinerange',
              'line',
              'errorbar',
              'boxplot',
              'areaspline',
              'spline',
              'bar',
              'scatter',
              'polygon',
              'bubble',
              'area',
              'column'
            ],
            subTypeDefaults: {
              arearange: 'null',
              areasplinerange: 'null',
              line: 'null',
              errorbar: 'null',
              boxplot: 'null',
              areaspline: 'null',
              spline: 'null',
              bar: 'null',
              scatter: 'null',
              polygon: 'null',
              bubble: 'null',
              area: 'null',
              column: 'null'
            },
            width: 33
          },
          {
            id: 'series-marker--symbol',
            pid: 'series.marker.symbol',
            dataType: 'string',
            context: 'General',
            parent: 'series<bubble>-marker',
            values:
              '[null, "circle", "square", "diamond", "triangle", "triangle-down"]',
            subType: [
              'bubble',
              'polygon',
              'line',
              'scatter',
              'spline',
              'area',
              'areaspline'
            ],
            subTypeDefaults: {},
            width: 49
          },
          {
            id: 'series--colorByPoint',
            pid: 'series.colorByPoint',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'series<treemap>',
            subType: [
              'treemap',
              'heatmap',
              'column',
              'errorbar',
              'columnrange',
              'boxplot',
              'bar',
              'waterfall'
            ],
            subTypeDefaults: {
              heatmap: 'false',
              column: 'false',
              errorbar: 'false',
              columnrange: 'false',
              boxplot: 'false',
              bar: 'false',
              waterfall: 'false'
            },
            width: 50
          },
          {
            id: 'series-marker--enabled',
            pid: 'series.marker.enabled',
            dataType: 'boolean',
            context: 'General',
            defaults: 'null',
            parent: 'series<bubble>-marker',
            subType: [
              'bubble',
              'area',
              'scatter',
              'areaspline',
              'spline',
              'polygon',
              'line'
            ],
            subTypeDefaults: {
              area: 'null',
              scatter: 'null',
              areaspline: 'null',
              spline: 'null',
              polygon: 'null',
              line: 'null'
            },
            width: 50
          },

          // {
          //   id: 'series-label--enabled',
          //   pid: 'series.label.enabled',
          //   defaults: 'true',
          //   dataType: 'boolean',
          //   subType: [
          //     'line',
          //     'spline',
          //     'area',
          //     'arearange',
          //     'areaspline',
          //     'waterfall',
          //     'areasplinerange'
          //   ],
          //   subTypeDefaults: {}
          // }

          // {
          // id: 'series-label--style',
          // pid: 'series.label.style',
          // dataType: 'font'
          // }
        ]
      }
    ],
    'option.cat.export': [
      {
        text: 'option.cat.exporting',
        dropdown: true,
        options: [
          {
            id: 'exporting--enabled',
            pid: 'exporting.enabled',
            dataType: 'boolean',
            context: 'General',
            defaults: 'true',
            parent: 'exporting',
            width: 50
          },      
          {
            id: 'exporting--offlineExporting',
            pid: 'exporting.offlineExporting',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'exporting',
            width: 50,
            plugins: [
              'modules/offline-exporting.js'
            ],
            noChange: true
          },
          {
            id: 'exporting--sourceWidth',
            custom: {
              minValue: 10,
              maxValue: 2000,
              step: 10
            },
            pid: 'exporting.sourceWidth',
            dataType: 'number',
            context: 'General',
            parent: 'exporting',
            values: ''
          },
          {
            id: 'exporting--scale',
            custom: {
              minValue: 1,
              maxValue: 4
            },
            pid: 'exporting.scale',
            dataType: 'number',
            context: 'General',
            defaults: '2',
            parent: 'exporting',
            values: ''
          }
        ]
      }
    ],
    'option.cat.legend': [
      {
        text: 'option.subcat.general',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'legend--enabled',
            pid: 'legend.enabled',
            dataType: 'boolean',
            context: 'General',
            defaults: 'true',
            parent: 'legend'
          },
          {
            id: 'legend--layout',
            pid: 'legend.layout',
            dataType: 'string',
            context: 'General',
            defaults: 'horizontal',
            parent: 'legend',
            values: '["horizontal", "vertical"]'
          }
        ]
      },
      {
        text: 'option.subcat.placement',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'legend--align',
            pid: 'legend.align',
            dataType: 'string',
            context: 'General',
            defaults: 'center',
            parent: 'legend',
            values: '["left", "center", "right"]',
            width: 50
          },
          {
            id: 'legend--verticalAlign',
            pid: 'legend.verticalAlign',
            dataType: 'string',
            context: 'General',
            defaults: 'bottom',
            parent: 'legend',
            values: '["top", "middle", "bottom"]',
            width: 50
          },
          {
            id: 'legend--floating',
            pid: 'legend.floating',
            dataType: 'boolean',
            context: 'General',
            defaults: 'false',
            parent: 'legend'
          }
        ]
      },
      {
        text: 'option.subcat.legendappearance',
        dropdown: true,
        options: [
          {
            id: 'legend--itemStyle',
            dataType: 'font',
            pid: 'legend.itemStyle',
            context: 'General',
            defaults:
              '{ "color": "#333333", "cursor": "pointer", "fontSize": "12px", "fontWeight": "bold" }',
            parent: 'legend'
          },
          {
            id: 'legend--backgroundColor',
            pid: 'legend.backgroundColor',
            dataType: 'color',
            context: 'General',
            parent: 'legend',
            width: 50
          },
          {
            id: 'legend--borderColor',
            pid: 'legend.borderColor',
            dataType: 'color',
            context: 'General',
            defaults: '#999999',
            parent: 'legend',
            width: 50
          },
          {
            id: 'legend--borderWidth',
            pid: 'legend.borderWidth',
            dataType: 'number',
            context: 'General',
            defaults: '0',
            parent: 'legend',
            width: 50
          },
          {
            id: 'legend--borderRadius',
            pid: 'legend.borderRadius',
            dataType: 'number',
            context: 'General',
            defaults: '0',
            parent: 'legend',
            width: 50
          }
        ]
      }
    ],
    'option.cat.localization': [
      {
        text: 'option.subcat.numberformat',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'lang--decimalPoint',
            pid: 'lang.decimalPoint',
            dataType: 'string',
            context: 'General',
            defaults: '.',
            parent: 'lang',
            width: 50
          },
          {
            id: 'lang--thousandsSep',
            pid: 'lang.thousandsSep',
            dataType: 'string',
            context: 'General',
            defaults: ' ',
            parent: 'lang',
            width: 50
          }
        ]
      },      
      {
        text: 'option.subcat.zoombutton',
        dropdown: true,
        group: 1,
        options: [
          {
            id: 'lang--resetZoom',
            pid: 'lang.resetZoom',
            dataType: 'string',
            context: 'General',
            defaults: 'Reset zoom',
            parent: 'lang'
          }
        ]
      },
      {
        text: 'option.subcat.exportbutton',
        dropdown: true,
        options: [
          {
            id: 'lang--contextButtonTitle',
            pid: 'lang.contextButtonTitle',
            dataType: 'string',
            context: 'General',
            defaults: 'Chart context menu',
            parent: 'lang',
            values: '',
            width: 50
          },
          {
            id: 'lang--printChart',
            pid: 'lang.printChart',
            dataType: 'string',
            context: 'General',
            defaults: 'Print chart',
            parent: 'lang',
            values: '',
            width: 50
          },
          {
            id: 'lang--downloadPNG',
            pid: 'lang.downloadPNG',
            dataType: 'string',
            context: 'General',
            defaults: 'Download PNG image',
            parent: 'lang',
            width: 50
          },
          {
            id: 'lang--downloadJPEG',
            pid: 'lang.downloadJPEG',
            dataType: 'string',
            context: 'General',
            defaults: 'Download JPEG image',
            parent: 'lang',
            width: 50
          },
          {
            id: 'lang--downloadPDF',
            pid: 'lang.downloadPDF',
            dataType: 'string',
            context: 'General',
            defaults: 'Download PDF document',
            parent: 'lang',
            width: 50
          },
          {
            id: 'lang--downloadSVG',
            pid: 'lang.downloadSVG',
            dataType: 'string',
            context: 'General',
            defaults: 'Download SVG vector image',
            parent: 'lang',
            width: 50
          }
        ]
      }
    ],
  }
};
