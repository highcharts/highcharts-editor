/******************************************************************************

Copyright (c) 2016, Highsoft

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

module.exports = function(i18next) {
    return {
        options: {
            [i18next.t('Titles')]: [{
                text: i18next.t('Main titles'),
                options: [{
                    text: i18next.t('Chart title'),
                    id: 'title--text',
                    tooltipText: i18next.t('The main chart title.'),
                }, {
                    text: i18next.t('Chart subtitle'),
                    id: 'subtitle--text',
                    tooltipText: i18next.t('The chart\'s subtitle, normally displayed with smaller fonts below the main title.'),
                }, {
                    text: i18next.t('Y axis title'),
                    id: 'yAxis-title--text',
                    tooltipText: i18next.t('The Y axis title, normally displayed vertically along the Y axis.'),
                    dataIndex: 0
                }]
            }],

            [i18next.t('General')]: [
                // {
                //  text: 'Label Items',
                //  options: [
                //      {text: 'Label Items:', id: 'labels-items'}
                //  ]
                // },
                {
                    text: i18next.t('Chart size'),
                    options: [
                        {
                            id: 'chart--width',
                            text: i18next.t('Chart width'),
                            custom: {minValue: 50, maxValue: 5000, step: 10}
                        },
                        {
                            id: 'chart--height',
                            text: i18next.t('Chart height'),
                            custom: {minValue: 50, maxValue: 5000, step: 10}
                        }
                    ]
                }, {
                    text: i18next.t('Chart Interaction'),
                    options: [
                        {id: 'chart--zoomType', text: i18next.t('Allow zooming')},
                        {id: 'chart--polar', text: i18next.t('Polar (radar) projection')},
                        {id: 'chart--reflow', text: i18next.t('Reflow on window resize')}
                    ]
                }
            ],

            [i18next.t('Appearance')]: [{
                text: i18next.t('Fonts'),
                options: [
                    {
                        id: 'chart--style',
                        text: i18next.t('Font family'),
                        dataType: 'font',
                        tooltipText: i18next.t('The font to use throughout the chart')
                    }
                ]
            }, {
                text: i18next.t('Titles'),
                options: [
                    {
                        id: 'title--style',
                        text: i18next.t('Main title style'),
                        dataType: 'font',
                        tooltipText: i18next.t('Styling for the main chart title')
                    },
                    //{id: 'title--text'},
                    {
                        id: 'subtitle--style',
                        text: i18next.t('Subtitle style'),
                        dataType: 'font',
                        tooltipText: i18next.t('Styling for the chart\'s subtitle, normally displayed with smaller fonts below the main title')
                    }

                ]
            }, {
                text: i18next.t('Series colors'),

                options: [{
                    id: 'colors',
                    text: i18next.t('Colors'),
                    tooltipText: i18next.t('Default colors for the data series, or for individual points in a pie series or a column series with individual colors. Colors will be picked in succession. If a color is explicitly set for each series in the <em>Data series</em> view, that color will take precedence.')
                }]
            }, {
                text: i18next.t('Chart area'),

                options: [
                    {
                        id: 'chart--backgroundColor',
                        text: i18next.t('Background color'),
                        tooltipText: i18next.t('Background color for the full chart area')
                    },
                    {id: 'chart--borderWidth', text: i18next.t('Border width'), custom: {minValue: 0}},
                    {id: 'chart--borderRadius', text: i18next.t('Border corner radius'), custom: {minValue: 0}},
                    {id: 'chart--borderColor', text: i18next.t('Border color')}
                ]
            }, {
                text: i18next.t('Plot area'),

                options: [
                    {
                        id: 'chart--plotBackgroundColor', text: i18next.t('Background color'),
                        tooltipText: i18next.t('Background color for the plot area, the area inside the axes')
                    },
                    {
                        id: 'chart--plotBackgroundImage', text: i18next.t('Background image URL'),
                        tooltipText: i18next.t('The online URL for an image to use as the plot area background')
                    },
                    {id: 'chart--plotBorderWidth', text: i18next.t('Border width')},
                    {id: 'chart--plotBorderColor', text: i18next.t('Border color')}
                ]
            }
            ],

            [i18next.t('Axes')]: [{
                text: i18next.t('Axes setup'),

                options: [
                    {id: 'chart--inverted', text: i18next.t('Inverted axes')}
                ]
            }, {
                id: 'xAxis',
                text: i18next.t('X-Axis'),

                options: [
                    // {
                    //  id: 'xAxis-crosshair',
                    //  text: 'Crosshair',
                    //  dataIndex: 0

                    // },
                    {
                        id: 'xAxis-title--style',
                        dataType: 'font',
                        text: i18next.t('X axis title'),
                        tooltipText: i18next.t('Styling and text for the X axis title'),
                        dataIndex: 0
                    },
                    {
                        id: 'xAxis-title--text',
                        text: i18next.t('Text'),
                        dataIndex: 0
                    },
                    {
                        id: 'xAxis--type',
                        text: i18next.t('Type'),
                        tooltipText: i18next.t('The type of axis'),
                        dataIndex: 0
                    },
                    {
                        id: 'xAxis--opposite',
                        text: i18next.t('Opposite side of chart'),
                        dataIndex: 0
                    },
                    {
                        id: 'xAxis--reversed',
                        text: i18next.t('Reversed direction'),
                        dataIndex: 0
                    },
                    {
                        id: 'xAxis-labels--format',
                        text: i18next.t('Axis labels format'),
                        tooltipText: i18next.t('<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p><p><b>Units</b> can be added for example like <code>{value} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals,or <code>{value:%Y-%m-%d}</code> for a certain time format.'),
                        dataIndex: 0
                    }//,
                    // {
                    //  id: 'xAxis-labels--rotation', text: 'Axis labels rotation',
                    //  custom: {step: 5, minValue: -90, maxValue: 90},
                    //  dataIndex: 0
                    // }
                ]
            }, {
                id: 'yAxis',
                text: i18next.t('Y-Axis'),

                options: [
                    // {
                    //  id: 'yAxis-crosshair',
                    //  text: 'Crosshair',
                    //  dataIndex: 0
                    // },
                    {
                        id: 'yAxis-title--style',
                        dataType: 'font',
                        text: i18next.t('Y axis title style'),
                        tooltipText: i18next.t('Styling and text for the X axis title'),
                        dataIndex: 0
                    },
                    //{id: 'yAxis-title--text'},
                    {
                        id: 'yAxis--type',
                        text: i18next.t('Type'),
                        tooltipText: i18next.t('The type of axis'),
                        dataIndex: 0
                    },
                    {
                        id: 'yAxis--opposite',
                        text: i18next.t('Opposite side of chart'),
                        dataIndex: 0
                    },
                    {
                        id: 'yAxis--reversed',
                        text: i18next.t('Reversed direction'),
                        dataIndex: 0
                    },
                    {
                        id: 'yAxis-labels--format',
                        text: i18next.t('Axis labels format'),
                        tooltipText: i18next.t('<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p><p><b>Units</b> can be added for example like <code>{value} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, or <code>{value:%Y-%m-%d}</code> for a certain time format.'),
                        dataIndex: 0
                    }
                ]
            }
            ],
            [i18next.t('Data series')]: [{
                id: 'series',
                array: true,
                text: i18next.t('Series'),
                controlledBy: {
                    title: i18next.t('Select Series'),
                    options: 'series',
                    optionsTitle: 'name'
                },
                filteredBy: 'series--type',
                options: [
                    {id: 'series--type', text: i18next.t('Series type'), tooltipText: i18next.t('The type of series')},
                    {
                        id: 'series--color',
                        text: i18next.t('Color'),
                        tooltipText: i18next.t('The main color of the series. If no color is given here, the color is pulled from the array of default colors as given in the "Appearance" section.')
                    },
                    {
                        id: 'series--negativeColor',
                        text: i18next.t('Negative color'),
                        tooltipText: i18next.t('The negative color of the series below the threshold. Threshold is default zero, this can be changed in the advanced settings.')
                    },
                    {
                        id: 'series--colorByPoint',
                        text: i18next.t('Color by point'),
                        tooltipText: i18next.t('Use one color per point. Colors can be changed in the "Appearance" section.')
                    },
                    {id: 'series--dashStyle', text: i18next.t('Dash style')},
                    {id: 'series-marker--enabled', text: i18next.t('Enable point markers')},
                    {id: 'series-marker--symbol', text: i18next.t('Marker symbol')},
                    //{id: 'series<*>-dataLabels--enabled', text: 'Enable data labels'},
                    {
                        id: 'series-tooltip--valuePrefix',
                        text: i18next.t('Prefix in tooltip'),
                        tooltipText: i18next.t('Text to prepend before the value in the tooltip')
                    },
                    {
                        id: 'series-tooltip--valueSuffix',
                        text: i18next.t('Suffix (unit) in tooltip'),
                        tooltipText: i18next.t('Text to append after the value in the tooltip')
                    }
                    // {id: 'series-seriesMapping--x', text: 'Explicit x column'},
                    // {id: 'series-seriesMapping--label', text: 'Explicit label column'},
                    // /*funnel*/
                    // {id: 'series--width', text: 'Funnel width'},
                    // {
                    //  id: 'series--neckWidth',
                    //  text: 'Neck width',
                    //  tooltipText: 'The width of the neck, the lower part of the funnel. A number defines pixel width, a percentage string, f. eks. \'25%\', defines a percentage of the plot area width. Defaults to 25%.'
                    // },
                    // {
                    //  id: 'series--neckHeight',
                    //  text: 'Neck height',
                    //  tooltipText: 'The height of the neck, the lower part of the funnel. A number defines pixel width, a percentage string, f. eks. \'25%\', defines a percentage of the plot area height. Defaults to 25%.'
                    // }
                ]
            }],

            [i18next.t('Value labels')]: [{
                id: 'data-labels',
                text: i18next.t('Value labels'),

                options: [{
                    id: 'plotOptions-series-dataLabels--enabled',
                    text: i18next.t('Enable data labels for all series'),
                    tooltipText: i18next.t('Show small labels next to each data value (point, column, pie slice etc)')
                }, {
                    id: 'plotOptions-series-dataLabels--format',
                    text: i18next.t('Data label format'),
                    tooltipText: i18next.t('<p>A format string for the value labels. The value is available through a variable <code>{y}</code>. Other available variables are <code>{x}</code> and <code>{key}</code> for the category.</p><p><b>Units</b> can be added for example like <code>{y} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {y:.2f}</code> to display two decimals, or <code>{x:%Y-%m-%d}</code> for a certain time format.')
                }, {
                    id: 'plotOptions-series-dataLabels--style',
                    text: i18next.t('Text style')
                }]
            }],

            [i18next.t('Legend')]: [
                {
                    text: i18next.t('General'),

                    options: [
                        {id: 'legend--enabled', text: i18next.t('Enable legend')},
                        {id: 'legend--layout', text: i18next.t('Item layout')}
                    ]
                }, {
                    text: i18next.t('Placement'),

                    options: [
                        {id: 'legend--align', text: i18next.t('Horizontal alignment')},
                        {
                            id: 'legend--x',
                            text: i18next.t('Horizontal offset'),
                            tooltipText: i18next.t('The pixel offset of the legend relative to its alignment')
                        },
                        {id: 'legend--verticalAlign', text: i18next.t('Vertical alignment')},
                        {
                            id: 'legend--y',
                            text: i18next.t('Vertical offset'),
                            tooltipText: i18next.t('The pixel offset of the legend relative to its alignment')
                        },
                        {id: 'legend--floating', text: i18next.t('Float on top of plot area')}
                    ]
                }, {
                    text: i18next.t('Appearance'),

                    options: [
                        {id: 'legend--itemStyle', text: i18next.t('Text style'), dataType: 'font'},
                        {id: 'legend--itemHiddenStyle', text: i18next.t('Text style hidden'), dataType: 'font'},
                        {id: 'legend--backgroundColor', text: i18next.t('Background color')},
                        {id: 'legend--borderWidth', text: i18next.t('Border width')},
                        {id: 'legend--borderRadius', text: i18next.t('Border corner radius')},
                        {id: 'legend--borderColor', text: i18next.t('Border color')}
                    ]
                }
            ],

            [i18next.t('Tooltip')]: [{
                text: i18next.t('General'),

                options: [
                    {
                        id: 'tooltip--enabled',
                        text: i18next.t('Enable tooltip'),
                        tooltipText: i18next.t('Enable or disable the tooltip. The tooltip is the information box that appears on mouse-over or touch on a point.')
                    },
                    {id: 'tooltip--shared', text: i18next.t('Shared between series'), tooltipText: i18next.t('When the tooltip is shared, the entire plot area will capture mouse movement or touch events. Tooltip texts for series types with ordered data (not pie, scatter, flags etc) will be shown in a single bubble. This is recommended for single series charts and for tablet/mobile optimized charts.')}
                ]
            }, {
                text: i18next.t('Color and border'),
                options: [
                    {
                        id: 'tooltip--backgroundColor',
                        text: i18next.t('Background color'),
                        tooltipText: i18next.t('The background color of the tooltip')
                    },
                    {id: 'tooltip--borderWidth', text: i18next.t('Border width'), custom: {minValue: 0}},
                    {id: 'tooltip--borderRadius', text: i18next.t('Border corner radius'), custom: {minValue: 0}},
                    {
                        id: 'tooltip--borderColor',
                        text: i18next.t('Border color'),
                        tooltipText: i18next.t('The border color of the tooltip. If no color is given, the corresponding series color is used.')
                    }
                ]
            }
            ],

            [i18next.t('Exporting')]: [{
                text: i18next.t('Exporting'),
                options: [{
                    id: 'exporting--enabled',
                    text: i18next.t('Enable exporting'),
                    tooltipText: i18next.t('Enable the context button on the top right of the chart, allowing end users to download image exports.')
                }, {
                    id: 'exporting--sourceWidth',
                    text: i18next.t('Exported width'),
                    tooltipText: i18next.t('Note that this overrides the scale property'),
                    custom: {
                        minValue: 10,
                        maxValue: 2000,
                        step: 10
                    },
                    tooltipText: i18next.t('The width of the original chart when exported. The pixel width of the exported image is then multiplied by the <em>Scaling factor</em>.')
                }, {
                    id: 'exporting--sourceHeight',
                    text: i18next.t('Exported height'),
                    custom: {
                        minValue: 10,
                        maxValue: 2000,
                        step: 10
                    },
                    tooltipText: i18next.t('Analogous to the <em>Exported width</em>')
                }, {
                    id: 'exporting--scale',
                    text: i18next.t('Scaling factor'),
                    tooltipText: i18next.t('The export scale. Note that this is overridden if width is set.'),
                    custom: {
                        minValue: 1,
                        maxValue: 4
                    }
                }]
            }
            ],

            [i18next.t('Localization')]: [{
                text: i18next.t('Number formatting'),
                options: [
                    {
                        id: 'lang--decimalPoint',
                        text: i18next.t('Decimal point'),
                        tooltipText: i18next.t('The decimal point used for all numbers')
                    },
                    {
                        id: 'lang--thousandsSep',
                        text: i18next.t('Thousands separator'),
                        tooltipText: i18next.t('The thousands separator used for all numbers')
                    }
                ]
            }, {
                text: i18next.t('Exporting button and menu'),
                options: [
                    {id: 'lang--contextButtonTitle', text: i18next.t('Context button title')},
                    {id: 'lang--printChart', text: i18next.t('Print chart')},
                    {id: 'lang--downloadPNG', text: i18next.t('Download PNG')},
                    {id: 'lang--downloadJPEG', text: i18next.t('Download JPEG')},
                    {id: 'lang--downloadPDF', text: i18next.t('Download PDF')},
                    {id: 'lang--downloadSVG', text: i18next.t('Download SVG')}
                ]
            }, {
                text: i18next.t('Zoom button'),
                options: [
                    {id: 'lang--resetZoom', text: i18next.t('Reset zoom button')},
                    {id: 'lang--resetZoomTitle', text: i18next.t('Reset zoom button title')}
                ]
            }
            ],

            [i18next.t('Credits')]: [{
                text: i18next.t('Chart credits'),
                options: [
                    {
                        id: 'credits--enabled',
                        text: i18next.t('Enable credits'),
                        tooltipText: i18next.t('Whether to show the credits text')
                    },
                    {
                        id: 'credits--text',
                        text: i18next.t('Credits text'),
                        tooltipText: i18next.t('The text for the credits label')
                    },
                    {
                        id: 'credits--href',
                        text: i18next.t('Link'),
                        tooltipText: i18next.t('The URL for the credits label')
                    }
                ]
            }]
        }
    }
};
