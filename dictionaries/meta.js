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

module.exports = {
	options: {
		'Titles': [{
			text: 'Main titles',			
			options: [{
				text: 'Chart title',
				id: 'title--text',
				tooltipText: 'The main chart title.'
			}, {
				text: 'Chart subtitle',
				id: 'subtitle--text',
				tooltipText: 'The chart\'s subtitle, normally displayed with smaller fonts below the main title.'
			}, {
				text: 'Y axis title',
				id: 'yAxis-title--text',
				tooltipText: 'The Y axis title, normally displayed vertically along the Y axis.',
				dataIndex: 0
			}]
		}],

		'General': [
			// {
			// 	text: 'Label Items',
			// 	options: [
			// 		{text: 'Label Items:', id: 'labels-items'}
			// 	]
			// },
			{
				text: 'Chart size',				
				options: [
					{
						id: 'chart--width',
						text: 'Chart width',
						custom: {minValue: 0, maxValue: 5000, step: 10}
					},
					{
						id: 'chart--height',
						text: 'Chart height',
						custom: {minValue: 0, maxValue: 5000, step: 10}
					}
				]
			}, {
				text: 'Chart Interaction',				
				options: [
					{id: 'chart--zoomType', text: 'Allow zooming'},
					{id: 'chart--polar', text: 'Polar (radar) projection'},
					{id: 'chart--reflow', text: 'Reflow on window resize'}
				]
			}
		],

		'Appearance': [{
			text: 'Fonts',			
			options: [
				{
					id: 'chart--style',
					text: 'Font family',
					tooltipText: 'The font to use throughout the chart'
				}
			]
		}, {
			text: 'Titles',			
			options: [
				{
					id: 'title--style',
					text: 'Main title style',
					tooltipText: 'Styling for the main chart title'
				},
				//{id: 'title--text'},
				{
					id: 'subtitle--style',
					text: 'Subtitle style',
					tooltipText: 'Styling for the chart\'s subtitle, normally displayed with smaller fonts below the main title'
				}

			]
		}, {
			text: 'Series colors',
			
			options: [{
				id: 'colors',
				text: 'Colors',
				tooltipText: 'Default colors for the data series, or for individual points in a pie series or a column series ' +
				'with individual colors. Colors will be picked in succession. If a color is explicitly set for each series ' +
				'in the <em>Data series</em> view, that color will take precedence.'
			}]
		}, {
			text: 'Chart area',
			
			options: [
				{
					id: 'chart--backgroundColor',
					text: 'Background color',
					tooltipText: 'Background color for the full chart area'
				},
				{id: 'chart--borderWidth', text: 'Border width', custom: {minValue: 0}},
				{id: 'chart--borderRadius', text: 'Border corner radius', custom: {minValue: 0}},
				{id: 'chart--borderColor', text: 'Border color'}
			]
		}, {
			text: 'Plot area',
			
			options: [
				{
					id: 'chart--plotBackgroundColor', text: 'Background color',
					tooltipText: 'Background color for the plot area, the area inside the axes'
				},
				{
					id: 'chart--plotBackgroundImage', text: 'Background image URL',
					tooltipText: 'The online URL for an image to use as the plot area background'
				},
				{id: 'chart--plotBorderWidth', text: 'Border width'},
				{id: 'chart--plotBorderColor', text: 'Border color'}
			]
		}
		],

		'Axes': [{
			text: 'Axes setup',
			
			options: [
				{id: 'chart--inverted', text: 'Inverted axes'}
			]
		}, {
			id: 'xAxis',
			text: 'X-Axis',
			
			options: [
				{
					id: 'xAxis-crosshair',
					text: 'Crosshair',
					dataIndex: 0

				},
				{
					id: 'xAxis-title--style',
					text: 'X axis title',
					tooltipText: 'Styling and text for the X axis title',
					dataIndex: 0
				},
				{
					id: 'xAxis-title--text',
					dataIndex: 0
				},
				{
					id: 'xAxis--type', 
					text: 'Type', 
					tooltipText: 'The type of axis',
					dataIndex: 0
				},
				{
					id: 'xAxis--opposite', 
					text: 'Opposite side of chart',
					dataIndex: 0
				},
				{
					id: 'xAxis--reversed', 
					text: 'Reversed direction',
					dataIndex: 0
				},
				{
					id: 'xAxis-labels--format', 
					text: 'Axis labels format',
					tooltipText: '<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p>' +
					'<p><b>Units</b> can be added for example like <code>{value} USD</code>.</p>' +
					'<p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, ' +
					'or <code>{value:%Y-%m-%d}</code> for a certain time format.',
					dataIndex: 0
				},
				{
					id: 'xAxis-labels--rotation', text: 'Axis labels rotation',
					custom: {step: 5, minValue: -90, maxValue: 90},
					dataIndex: 0
				}
			]
		}, {
			id: 'yAxis',
			text: 'Y-Axis',
			
			options: [
				{
					id: 'yAxis-crosshair',
					text: 'Crosshair',
					dataIndex: 0
				},
				{
					id: 'yAxis-title--style',
					text: 'Y axis title',
					tooltipText: 'Styling and text for the X axis title',
					dataIndex: 0
				},
				//{id: 'yAxis-title--text'},
				{
					id: 'yAxis--type', 
					text: 'Type', 
					tooltipText: 'The type of axis',
					dataIndex: 0
				},
				{
					id: 'yAxis--opposite', 
					text: 'Opposite side of chart',
					dataIndex: 0
				},
				{
					id: 'yAxis--reversed', 
					text: 'Reversed direction',
					dataIndex: 0
				},
				{
					id: 'yAxis-labels--format', 
					text: 'Axis labels format',
					tooltipText: '<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p>' +
					'<p><b>Units</b> can be added for example like <code>{value} USD</code>.</p>' +
					'<p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, ' +
					'or <code>{value:%Y-%m-%d}</code> for a certain time format.',
					dataIndex: 0
				}
			]
		}
		],
		'Data series': [{
			id: 'series',
			array: true,
			text: 'Series',
			controlledBy: {
				title: 'Select Series',
				options: 'series',
				optionsTitle: 'name'
			},
			filteredBy: 'series--type',
			options: [
				{id: 'series--type', text: 'Series type', tooltipText: 'The type of series'},
				{
					id: 'series--color',
					text: 'Color',
					tooltipText: 'The main color of the series. If no color is given here, the color ' +
					'is pulled from the array of default colors as given in the "Appearance" section.'
				},
				{
					id: 'series--negativeColor',
					text: 'Negative color',
					tooltipText: 'The negative color of the series below the threshold. Threshold is default zero, this can be changed in the advanced settings.'
				},
				{
					id: 'series--colorByPoint',
					text: 'Color by point',
					tooltipText: 'Use one color per point. Colors can be changed in the "Appearance" section.'
				},
				{id: 'series--dashStyle', text: 'Dash style'},
				{id: 'series-marker--enabled', text: 'Enable point markers'},
				{id: 'series-marker--symbol', text: 'Marker symbol'},
				//{id: 'series<*>-dataLabels--enabled', text: 'Enable data labels'},
				{
					id: 'series-tooltip--valuePrefix',
					text: 'Prefix in tooltip',
					tooltipText: 'Text to prepend before the value in the tooltip'
				},
				{
					id: 'series-tooltip--valueSuffix',
					text: 'Suffix (unit) in tooltip',
					tooltipText: 'Text to append after the value in the tooltip'
				}
				// {id: 'series-seriesMapping--x', text: 'Explicit x column'},
				// {id: 'series-seriesMapping--label', text: 'Explicit label column'},
				// /*funnel*/
				// {id: 'series--width', text: 'Funnel width'},
				// {
				// 	id: 'series--neckWidth',
				// 	text: 'Neck width',
				// 	tooltipText: 'The width of the neck, the lower part of the funnel. A number defines pixel width, a percentage string, f. eks. \'25%\', defines a percentage of the plot area width. Defaults to 25%.'
				// },
				// {
				// 	id: 'series--neckHeight',
				// 	text: 'Neck height',
				// 	tooltipText: 'The height of the neck, the lower part of the funnel. A number defines pixel width, a percentage string, f. eks. \'25%\', defines a percentage of the plot area height. Defaults to 25%.'
				// }
			]
		}],

		'Value labels': [{
			id: 'data-labels',
			text: 'Value labels',
			
			options: [{
				id: 'plotOptions-series-dataLabels--enabled',
				text: 'Enable data labels for all series',
				tooltipText: 'Show small labels next to each data value (point, column, pie slice etc)'
			}, {
				id: 'plotOptions-series-dataLabels--format',
				text: 'Data label format',
				tooltipText: '<p>A format string for the value labels. The value is available through a variable <code>{y}</code>. Other available variables ' +
				'are <code>{x}</code> and <code>{key}</code> for the category.</p>' +
				'<p><b>Units</b> can be added for example like <code>{y} USD</code>.</p>' +
				'<p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {y:.2f}</code> to display two decimals, ' +
				'or <code>{x:%Y-%m-%d}</code> for a certain time format.'
			}, {
				id: 'plotOptions-series-dataLabels--style',
				text: 'Text style'
			}]
		}],

		'Legend': [
			{
				text: 'General',
				
				options: [
					{id: 'legend--enabled', text: 'Enable legend'},
					{id: 'legend--layout', text: 'Item layout'}
				]
			}, {
				text: 'Placement',
				
				options: [
					{id: 'legend--align', text: 'Horizontal alignment'},
					{
						id: 'legend--x',
						text: 'Horizontal offset',
						tooltipText: 'The pixel offset of the legend relative to its alignment'
					},
					{id: 'legend--verticalAlign', text: 'Vertical alignment'},
					{
						id: 'legend--y',
						text: 'Vertical offset',
						tooltipText: 'The pixel offset of the legend relative to its alignment'
					},
					{id: 'legend--floating', text: 'Float on top of plot area'}
				]
			}, {
				text: 'Appearance',
				
				options: [
					{id: 'legend--itemStyle', text: 'Text style'},
					{id: 'legend--itemHiddenStyle', text: 'Text style hidden'},
					{id: 'legend--backgroundColor', text: 'Background color'},
					{id: 'legend--borderWidth', text: 'Border width'},
					{id: 'legend--borderRadius', text: 'Border corner radius'},
					{id: 'legend--borderColor', text: 'Border color'}
				]
			}
		],

		'Tooltip': [{
			text: 'General',
			
			options: [
				{
					id: 'tooltip--enabled',
					text: 'Enable tooltip',
					tooltipText: 'Enable or disable the tooltip. The tooltip is the information box ' +
					'that appears on mouse-over or touch on a point.'
				},
				{id: 'tooltip--shared', text: 'Shared between series'}
			]
		}, {
			text: 'Color and border',			
			options: [
				{
					id: 'tooltip--backgroundColor',
					text: 'Background color',
					tooltipText: 'The background color of the tooltip'
				},
				{id: 'tooltip--borderWidth', text: 'Border width', custom: {minValue: 0}},
				{id: 'tooltip--borderRadius', text: 'Border corner radius', custom: {minValue: 0}},
				{
					id: 'tooltip--borderColor',
					text: 'Border color',
					tooltipText: 'The border color of the tooltip. If no color is given, ' +
					'the corresponding series color is used.'
				}
			]
		}
		],

		'Exporting': [{
			text: 'Exporting',		
			options: [{
				id: 'exporting--enabled',
				text: 'Enable exporting',
				tooltipText: 'Enable the context button on the top right of the chart, allowing end users ' +
				'to download image exports.'
			}, {
				id: 'exporting--sourceWidth',
				text: 'Exported width',
				tooltipText: 'Note that this overrides the scale property',
				custom: {
					minValue: 10,
					maxValue: 2000,
					step: 10
				},
				tooltipText: 'The width of the original chart when exported. The pixel width of the exported image is then ' +
				'multiplied by the <em>Scaling factor</em>.'
			}, {
				id: 'exporting--sourceHeight',
				text: 'Exported height',
				custom: {
					minValue: 10,
					maxValue: 2000,
					step: 10
				},
				tooltipText: 'Analogous to the <em>Exported width</em>'
			}, {
				id: 'exporting--scale',
				text: 'Scaling factor',
				tooltipText: 'The export scale. Note that this is overridden if width is set.',
				custom: {
					minValue: 1,
					maxValue: 4
				}
			}]
		}
		],

		'Localization': [{
			text: 'Number formatting',			
			options: [
				{
					id: 'lang--decimalPoint',
					text: 'Decimal point',
					tooltipText: 'The decimal point used for all numbers'
				},
				{
					id: 'lang--thousandsSep',
					text: 'Thousands separator',
					tooltipText: 'The thousands separator used for all numbers'
				}
			]
		}, {
			text: 'Exporting button and menu',			
			options: [
				{id: 'lang--contextButtonTitle', text: 'Context button title'},
				{id: 'lang--printChart', text: 'Print chart'},
				{id: 'lang--downloadPNG', text: 'Download PNG'},
				{id: 'lang--downloadJPEG', text: 'Download JPEG'},
				{id: 'lang--downloadPDF', text: 'Download PDF'},
				{id: 'lang--downloadSVG', text: 'Download SVG'}
			]
		}, {
			text: 'Zoom button',			
			options: [
				{id: 'lang--resetZoom', text: 'Reset zoom button'},
				{id: 'lang--resetZoomTitle', text: 'Reset zoom button title'}
			]
		}
		],

		'Credits': [{
			text: 'Chart credits (Requires license)',			
			options: [
				{
					id: 'credits--enabled',
					text: 'Enable credits',
					tooltipText: 'Whether to show the credits text'
				},
				{
					id: 'credits--text',
					text: 'Credits text',
					tooltipText: 'The text for the credits label'
				},
				{
					id: 'credits--href',
					text: 'Link',
					tooltipText: 'The URL for the credits label'
				}
			]
		}]
	}
};
