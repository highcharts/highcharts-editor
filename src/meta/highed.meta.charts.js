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

highed.meta.chartTemplates = {
	line: {
		title: 'Line charts',
		templates: {
			basic: {
				title: 'Line chart',
				urlImg: 'https://cloud.highcharts.com/images/abywon/0/136.svg',
				config: {
					'chart--type': 'line'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			withdatalabel: {
				title: 'With data labels',
				urlImg: 'https://cloud.highcharts.com/images/agonam/2/136.svg',
				config: {
					'chart--type': 'line',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values. ' +
				'Data labels by default displays the Y value.'
			},
			spline: {
				title: 'Spline',
				urlImg: 'https://cloud.highcharts.com/images/upafes/1/136.svg',
				config: {
					'chart--type': 'spline'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			splineWithDataLabel: {
				title: 'Spline with labels',
				urlImg: 'https://cloud.highcharts.com/images/odopic/2/136.svg',
				config: {
					'chart--type': 'spline',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			logarithmic: {
				title: 'Logarithmic',
				urlImg: 'https://cloud.highcharts.com/images/abywon/0/136.svg',
				config: {
					'chart--type': 'line',
					'yAxis--type': 'logarithmic',
					'yAxis--minorTickInterval': 'auto'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			stepLine: {
				title: 'Step line',
				urlImg: 'https://cloud.highcharts.com/images/akeduw/0/136.svg',
				config: {
					'chart--type': 'line',
					'plotOptions-line--step': 'left'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			stepLineWithDataLabel: {
				title: 'Step line with labels',
				urlImg: 'https://cloud.highcharts.com/images/oxenux/0/136.svg',
				config: {
					'chart--type': 'line',
					'plotOptions-series-dataLabels--enabled': true,
					'plotOptions-line--step': 'left'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			inverted: {
				title: 'Inverted',
				urlImg: 'https://cloud.highcharts.com/images/ozojul/1/136.svg',
				config: {
					'chart--type': 'line',
					'chart--inverted': true
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			negative: {
				title: 'Negative color',
				urlImg: 'https://cloud.highcharts.com/images/uxyfys/2/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--negativeColor': '#0088FF',
					'series[0]--color': '#FF0000'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			errorbar: {
				title: 'Error bar',
				urlImg: 'https://cloud.highcharts.com/images/ypewak/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'line',
					'series[1]--type': 'errorbar'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values. ' +
				'and two columns for the error bar series maximum and minimum.'
			},
			combination: {
				title: 'Combination chart',
				urlImg: 'https://cloud.highcharts.com/images/ynikoc/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'column'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values. and two columns for the error bar series maximum and minimum.'
			}
		}
	},
	area: {
		title: 'Area charts',
		templates: {
			basic: {
				title: 'Basic',
				urlImg: 'https://cloud.highcharts.com/images/ecexev/2/136.svg',
				config: {
					'chart--type': 'area'
				},
				tooltipText: 'Non-stacked area chart. Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			basicDatalabels: {
				title: 'Area with labels',
				urlImg: 'https://cloud.highcharts.com/images/atikon/0/136.svg',
				config: {
					'chart--type': 'area',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Non-stacked area chart with data labels. Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			stacked: {
				title: 'Stacked',
				urlImg: 'https://cloud.highcharts.com/images/inebav/1/136.svg',
				config: {
					'chart--type': 'area',
					'plotOptions-series--stacking': 'normal'
				},
				tooltipText: 'Stacked area chart. Requires one column for X values or categories, subsequently one column for each series\' Y values. ' +
				'The first data series is in the top of the stack.'
			},
			stackedDatalabels: {
				title: 'Stacked with labels',
				urlImg: 'https://cloud.highcharts.com/images/iluryh/0/136.svg',
				config: {
					'chart--type': 'area',
					'plotOptions-series--stacking': 'normal',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Stacked area chart. Requires one column for X values or categories, subsequently one column for each series\' Y values. ' +
				'The first data series is in the top of the stack.'
			},
			percentage: {
				title: 'Stacked percentage',
				urlImg: 'https://cloud.highcharts.com/images/iporos/1/136.svg',
				config: {
					'chart--type': 'area',
					'plotOptions-series--stacking': 'percent'
				},
				tooltipText: 'Stacked percentage area chart. Requires one column for X values or categories, subsequently one column for each series\' Y values. ' +
				'The first data series is in the top of the stack.'
			},
			inverted: {
				title: 'Inverted',
				urlImg: 'https://cloud.highcharts.com/images/yqenid/0/136.svg',
				config: {
					'chart--type': 'area',
					'chart--inverted': true
				},
				tooltipText: 'Area chart with inverted axes. Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			invertedDatalabels: {
				title: 'Inverted with labels',
				urlImg: 'https://cloud.highcharts.com/images/acemyq/0/136.svg',
				config: {
					'chart--type': 'area',
					'chart--inverted': true,
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Area chart with inverted axes and data labels. Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			stepLine: {
				title: 'Step line',
				urlImg: 'https://cloud.highcharts.com/images/abutix/0/136.svg',
				config: {
					'chart--type': 'area',
					'plotOptions-area--step': 'left'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			negative: {
				title: 'Negative color',
				urlImg: 'https://cloud.highcharts.com/images/ydypal/0/136.svg',
				config: {
					'chart--type': 'area',
					'series[0]--negativeColor': '#0088FF',
					'series[0]--color': '#FF0000'
				},
				tooltipText: 'Displays negative values with an alternative color. Colors can be set in Customize -> Simple -> Data series. Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			arearange: {
				title: 'Arearange',
				urlImg: 'https://cloud.highcharts.com/images/udepat/0/136.svg',
				config: {
					'chart--type': 'arearange'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently two data column for each arearange series\' Y values.'
			}
		}
	},
	column: {
		title: 'Column charts',
		templates: {
			grouped: {
				title: 'Basic',
				urlImg: 'https://cloud.highcharts.com/images/ovobiq/1/136.svg',
				config: {
					'chart--type': 'column'
				},
				tooltipText: 'Grouped column chart. Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			groupedLabels: {
				title: 'With label',
				urlImg: 'https://cloud.highcharts.com/images/ivetir/1/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Grouped column chart with datalabels. Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			column3d: {
				title: 'Column 3D',
				urlImg: 'https://cloud.highcharts.com/images/ahyqyx/1/136.svg',
				config: {
					'chart--type': 'column',
					'chart--margin': 75,
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 15,
					'chart-options3d--beta': 15,
					'chart-options3d--depth': 50,
					'chart-options3d--viewDistance': 15,
					'plotOptions-column--depth': 25
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			columnstacked: {
				title: 'Stacked',
				urlImg: 'https://cloud.highcharts.com/images/ycehiz/1/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--stacking': 'normal'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			columnstackedLabels: {
				title: 'Stacked with labels',
				urlImg: 'https://cloud.highcharts.com/images/acijil/0/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--stacking': 'normal',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			columnStacked3d: {
				title: 'Stacked 3D',
				urlImg: 'https://cloud.highcharts.com/images/ahyqyx/1/136.svg',
				config: {
					'chart--type': 'column',
					'chart--margin': 75,
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 15,
					'chart-options3d--beta': 15,
					'chart-options3d--depth': 50,
					'chart-options3d--viewDistance': 15,
					'plotOptions-column--depth': 25,
					'plotOptions-series--stacking': 'normal'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			columnStackedPercentage: {
				title: 'Stacked percent',
				urlImg: 'https://cloud.highcharts.com/images/ojixow/0/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--stacking': 'percent'
				},
				tooltipText: 'Grouped column chart. Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			columnStackedPercentageLabels: {
				title: 'Stacked percent with labels',
				urlImg: 'https://cloud.highcharts.com/images/iwanyg/0/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--stacking': 'percent',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Grouped column chart. Requires one data column for X values or categories, subsequently one data column for each series\' Y values.'
			},
			negative: {
				title: 'Negative color',
				urlImg: 'https://cloud.highcharts.com/images/yxajih/0/136.svg',
				config: {
					'chart--type': 'column',
					'series[0]--negativeColor': '#0088FF',
					'series[0]--color': '#FF0000'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			multiColor: {
				title: 'Multi color',
				urlImg: 'https://cloud.highcharts.com/images/alyqyz/0/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--colorByPoint': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			logarithmic: {
				title: 'Logarithmic',
				urlImg: 'https://cloud.highcharts.com/images/igipeg/0/136.svg',
				config: {
					'chart--type': 'column',
					'yAxis--type': 'logarithmic',
					'yAxis--minorTickInterval': 'auto'
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			columnrange: {
				title: 'Columnrange',
				urlImg: 'https://cloud.highcharts.com/images/ihilaq/0/136.svg',
				config: {
					'chart--type': 'columnrange'
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'two data column for each series\' Y values (horizontal axis).'
			},
			columnrangeLabelsLabels: {
				title: 'Columnrange with labels',
				urlImg: 'https://cloud.highcharts.com/images/ojykiw/0/136.svg',
				config: {
					'chart--type': 'columnrange',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'two data column for each series\' Y values (horizontal axis).'
			},
			packedColumns: {
				title: 'Packed columns',
				urlImg: 'https://cloud.highcharts.com/images/exypor/0/136.svg',
				config: {
					'chart--type': 'column',
					'plotOptions-series--pointPadding': 0,
					'plotOptions-series--groupPadding': 0,
					'plotOptions-series--borderWidth': 0,
					'plotOptions-series--shadow': false
				},
				tooltiptext: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values.'
			},
			errorbar: {
				title: 'Error bar',
				urlImg: 'https://cloud.highcharts.com/images/icytes/0/136.svg',
				config: {
					'chart--type': 'column',
					'series[1]--type': 'errorbar'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values. and two columns for the error bar series maximum and minimum.'
			}
		}
	},
	bar: {
		title: 'Bar charts',
		templates: {
			basic: {
				title: 'Basic bar',
				urlImg: 'https://cloud.highcharts.com/images/ovuvul/1/137.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			basicLabels: {
				title: 'Basic with labels',
				urlImg: 'https://cloud.highcharts.com/images/ovuvul/1/137.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			barstacked: {
				title: 'Stacked bar',
				urlImg: 'https://cloud.highcharts.com/images/epodat/3/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series--stacking': 'normal'
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			barstackedLabels: {
				title: 'Stacked with labels',
				urlImg: 'https://cloud.highcharts.com/images/otupaz/1/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series--stacking': 'normal',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			barstackedpercentage: {
				title: 'Stacked percent bar',
				urlImg: 'https://cloud.highcharts.com/images/yhekaq/2/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series--stacking': 'percent'
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			barstackedpercentageLabels: {
				title: 'Stacked percentage with labels',
				urlImg: 'https://cloud.highcharts.com/images/izoqyx/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series--stacking': 'percent',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			negative: {
				title: 'Negative color',
				urlImg: 'https://cloud.highcharts.com/images/efygam/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'series[0]--negativeColor': '#0088FF',
					'series[0]--color': '#FF0000'
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			multiColor: {
				title: 'Multi color',
				urlImg: 'https://cloud.highcharts.com/images/ogixak/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series-colorByPoint': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			logarithmic: {
				title: 'Logarithmic',
				urlImg: 'https://cloud.highcharts.com/images/imykus/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'yAxis--type': 'logarithmic',
					'yAxis--minorTickInterval': 'auto'
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'one data column for each series\' Y values (horizontal axis).'
			},
			barRange: {
				title: 'Horizontal columnrange',
				urlImg: 'https://cloud.highcharts.com/images/iqagel/0/136.svg',
				config: {
					'chart--type': 'columnrange',
					'chart--inverted': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'two data column for each series\' Y values (horizontal axis).'
			},
			barRangeLabels: {
				title: 'Columnrange with labels',
				urlImg: 'https://cloud.highcharts.com/images/eracar/0/136.svg',
				config: {
					'chart--type': 'columnrange',
					'chart--inverted': true,
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires one data column for X values or categories (vertical axis), subsequently ' +
				'two data column for each series\' Y values (horizontal axis).'
			},
			packedColumns: {
				title: 'Packed columns',
				urlImg: 'https://cloud.highcharts.com/images/orixis/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'plotOptions-series--pointPadding': 0,
					'plotOptions-series--groupPadding': 0,
					'plotOptions-series--borderWidth': 0,
					'plotOptions-series--shadow': false
				},
				tooltiptext: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values.'
			},
			errorbar: {
				title: 'Error bar',
				urlImg: 'https://cloud.highcharts.com/images/omikax/0/136.svg',
				config: {
					'chart--type': 'column',
					'chart--inverted': true,
					'series[1]--type': 'errorbar'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for the series\' Y values. and two columns for the error bar series maximum and minimum.'
			}
		}
	},
	scatterandbubble: {
		title: 'Scatter and Bubble',
		templates: {
			scatter: {
				title: 'Scatter chart',
				urlImg: 'https://cloud.highcharts.com/images/ezatat/0/136.svg',
				config: {
					'chart--type': 'scatter'
				},
				tooltipText: 'Requires one data column for X values and one for Y values.'
			},
			bubbles: {
				title: 'Bubble chart',
				urlImg: 'https://cloud.highcharts.com/images/usyfyw/0/136.svg',
				config: {
					'chart--type': 'bubble'
				},
				tooltipText: 'Requires three data columns: one for X values, one for Y values and one for the size of the bubble (Z value).'
			},
			scatterLine: {
				title: 'Scatter with line',
				urlImg: 'https://cloud.highcharts.com/images/ydaqok/0/136.svg',
				config: {
					'chart--type': 'scatter',
					'plotOptions-series--lineWidth': 1
				},
				tooltipText: 'Requires one data column for X values and one for Y values.'
			},
			scatterLineNoMarker: {
				title: 'Scatter with line, no marker',
				urlImg: 'https://cloud.highcharts.com/images/uvepiw/0/136.svg',
				config: {
					'chart--type': 'scatter',
					'plotOptions-series--lineWidth': 1
				},
				tooltipText: 'Requires one data column for X values and one for Y values.'
			}
		}
	},
	pie: {
		title: 'Pie charts',
		templates: {
			pie: {
				title: 'Pie chart',
				urlImg: 'https://cloud.highcharts.com/images/yqoxob/3/136.svg',
				config: {
					'chart--type': 'pie',
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--cursor': true,
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			},
			pie3D: {
				title: '3D Pie chart',
				urlImg: 'https://cloud.highcharts.com/images/erifer/3/136.svg',
				config: {
					'chart--type': 'pie',
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 45,
					'chart-options3d--beta': 0,
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--depth': 35,
					'plotOptions-pie--cursor': 'pointer',
					'plotOptions-series-dataLabels--enabled': true
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			},
			pielegend: {
				title: 'Pie with legend',
				urlImg: 'https://cloud.highcharts.com/images/anofof/0/136.svg',
				config: {
					'chart--type': 'pie',
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--cursor': true,
					'plotOptions-pie--showInLegend': true,
					'plotOptions-pie-dataLabels--enabled': false
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in the legend) and one for their values.'
			},
			pie3Dlegend: {
				title: '3D Pie with legend',
				urlImg: 'https://cloud.highcharts.com/images/ubopaq/0/136.svg',
				config: {
					'chart--type': 'pie',
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 45,
					'chart-options3d--beta': 0,
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--depth': 35,
					'plotOptions-pie--cursor': 'pointer',
					'plotOptions-pie--showInLegend': true,
					'plotOptions-pie-dataLabels--enabled': false
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in legend) and one for their values.'
			},
			donut: {
				title: 'Donut',
				urlImg: 'https://cloud.highcharts.com/images/upaxab/2/136.svg',
				config: {
					'chart--type': 'pie',
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--cursor': true,
					'plotOptions-pie--innerSize': '60%',
					'plotOptions-pie-dataLabels--enabled': true
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			},
			donutlegend: {
				title: 'Donut with legend',
				urlImg: 'https://cloud.highcharts.com/images/arutag/1/136.svg',
				config: {
					'chart--type': 'pie',
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--cursor': true,
					'plotOptions-pie--showInLegend': true,
					'plotOptions-pie--innerSize': '60%',
					'plotOptions-pie-dataLabels--enabled': false
				},
				tooltipText: 'Donut with categories. Requires two data columns: one for slice names (shown in legend) and one for their values.'
			},
			donut3D: {
				title: '3D Donut chart',
				urlImg: 'https://cloud.highcharts.com/images/ehuvoh/3/136.svg',
				config: {
					'chart--type': 'pie',
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 45,
					'chart-options3d--beta': 0,
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--depth': 35,
					'plotOptions-pie--cursor': 'pointer',
					'plotOptions-series-dataLabels--enabled': true,
					'plotOptions-pie--innerSize': '60%'
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			},
			donut3Dlegend: {
				title: '3D Donut chart with legend',
				urlImg: 'https://cloud.highcharts.com/images/oriwyb/1/136.svg',
				config: {
					'chart--type': 'pie',
					'chart-options3d--enabled': true,
					'chart-options3d--alpha': 45,
					'chart-options3d--beta': 0,
					'plotOptions-pie--allowPointSelect': true,
					'plotOptions-pie--depth': 35,
					'plotOptions-pie--cursor': 'pointer',
					'plotOptions-series-dataLabels--enabled': false,
					'plotOptions-pie--showInLegend': true,
					'plotOptions-pie--innerSize': '60%'
				},
				tooltipText: '3D Donut with categories. Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			},
			semicircledonut: {
				title: 'Semi circle donut',
				urlImg: 'https://cloud.highcharts.com/images/iwyfes/2/136.svg',
				config: {
					'chart--type': 'pie',
					'plotOptions-pie--allowPointSelect': false,
					'plotOptions-series-dataLabels--enabled': true,
					'plotOptions-pie-dataLabels--distance': -30,
					'plotOptions-pie-dataLabels--style': {
						fontWeight: 'bold',
						color: 'white',
						textShadow: '0px 1px 2px black'
					},
					'plotOptions-pie--innerSize': '50%',
					'plotOptions-pie--startAngle': -90,
					'plotOptions-pie--endAngle': 90,
					'plotOptions-pie--center': ['50%', '75%']
				},
				tooltipText: 'Requires two data columns: one for slice names (shown in data labels) and one for their values.'
			}
		}
	},
	polar: {
		title: 'Polar',
		templates: {
			polarLine: {
				title: 'Polar line',
				urlImg: 'https://cloud.highcharts.com/images/ajogud/2/136.svg',
				config: {
					'chart--type': 'line',
					'chart--polar': true
				},
				tooltipText: 'Requires one column for X values or categories (labels around the perimeter), subsequently one column for each series\' Y values ' +
				'(plotted from center and out).'
			},
			spiderLine: {
				title: 'Spider line',
				urlImg: 'https://cloud.highcharts.com/images/uqonaj/0/136.svg',
				config: {
					'chart--type': 'line',
					'chart--polar': true,
					'xAxis--tickmarkPlacement': 'on',
					'xAxis--lineWidth': 0,
					'yAxis--lineWidth': 0,
					'yAxis--gridLineInterpolation': 'polygon'
				},
				tooltipText: 'Requires one column for X values or categories (labels around the perimeter), subsequently one column for each series\' Y values ' +
				'(plotted from center and out).'
			},
			polarArea: {
				title: 'Polar area',
				urlImg: 'https://cloud.highcharts.com/images/oqajux/0/136.svg',
				config: {
					'chart--type': 'area',
					'chart--polar': true
				},
				tooltipText: 'Requires one column for X values or categories (labels around the perimeter), subsequently one column for each series\' Y values ' +
				'(plotted from center and out).'
			},
			spiderArea: {
				title: 'Spider area',
				urlImg: 'https://cloud.highcharts.com/images/exajib/0/136.svg',
				config: {
					'chart--type': 'area',
					'chart--polar': true,
					'xAxis--tickmarkPlacement': 'on',
					'xAxis--lineWidth': 0,
					'yAxis--lineWidth': 0,
					'yAxis--gridLineInterpolation': 'polygon'
				},
				tooltipText: 'Requires one column for X values or categories (labels around the perimeter), subsequently one column for each series\' Y values ' +
				'(plotted from center and out).'
			}
		}
	},
	stock: {
		title: 'Stock charts',
		templates: {
			basic: {
				title: 'Basic',
				urlImg: 'https://cloud.highcharts.com/images/awuhad/3/136.svg',
				constr: 'StockChart',
				config: {
					'chart--type': 'line',
					'rangeSelector--enabled': false
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			areastock: {
				title: 'Area',
				urlImg: 'https://cloud.highcharts.com/images/ukaqor/136.svg',
				constr: 'StockChart',
				config: {
					'chart--type': 'area',
					'rangeSelector--enabled': false
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			columnstock: {
				title: 'Column',
				urlImg: 'https://cloud.highcharts.com/images/ogywen/136.svg',
				constr: 'StockChart',
				config: {
					'chart--type': 'column',
					'rangeSelector--enabled': false
				},
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.'
			},
			ohlc: {
				title: 'OHLC',
				urlImg: 'https://cloud.highcharts.com/images/opilip/2/136.svg',
				constr: 'StockChart',
				config: {
					'chart--type': 'ohlc',
					'rangeSelector--enabled': false
				},
				tooltipText: 'Requires one column for X values or categories, subsequently four columns for each series\' Y values, e.g. open, high, low, close.'
			},
			candlestick: {
				title: 'Candlestick',
				urlImg: 'https://cloud.highcharts.com/images/etybef/0/136.svg',
				constr: 'StockChart',
				config: {
					'chart--type': 'candlestick',
					'rangeSelector--enabled': false
				},
				tooltipText: 'Requires one column for X values or categories, subsequently four columns for each series\' Y values, e.g. open, high, low, close.'
			}
		}
	},
	more: {
		title: 'More types',
		templates: {
			solidgauge: {
				title: 'Solid gauge',
				urlImg: 'https://cloud.highcharts.com/images/apocob/0/136.svg',
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.',
				config: {
					'chart--type': 'solidgauge',
					'pane--center': ['50%', '85%'],
					'pane--size': '140%',
					'pane--startAngle': '-90',
					'pane--endAngle': '90',
					'pane--background': {
						backgroundColor: '#EEE',
						innerRadius: '60%',
						outerRadius: '100%',
						shape: 'arc'
					},
					'tooltip--enabled': false,
					'yAxis--stops': [
						[0.1, '#55BF3B'], // green
						[0.5, '#DDDF0D'], // yellow
						[0.9, '#DF5353'] // red
					],
					'yAxis--min': 0,
					'yAxis--max': 100,
					'yAxis--lineWidth': 0,
					'yAxis--minorTickInterval': null,
					'yAxis--tickPixelInterval': 400,
					'yAxis--tickWidth': 0,
					'yAxis-title--y': -70,
					'yAxis-labels--y': 16,
					'plotOptions-solidgauge-dataLabels--y': 10,
					'plotOptions-solidgauge-dataLabels--borderWidth': 0,
					'plotOptions-solidgauge-dataLabels--useHTML': true,
					'series[0]-dataLabels--format': '<div style="text-align:center"><span style="font-size:25px;color:#000000">{y}</span></div>'
				}
			},
			funnel: {
				title: 'Funnel',
				urlImg: 'https://cloud.highcharts.com/images/exumeq/0/136.svg',
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.',
				config: {
					'chart--type': 'funnel',
					'plotOptions-series-datalabels--color': '#000000',
					'plotOptions-series-dataLabels--softConnector': true,
					'plotOptions-series--neckWidth': '20%',
					'plotOptions-series--neckHeight': '35%',
					'series[0]--width': '64%'
				}
			},
			pyramid: {
				title: 'Pyramid',
				urlImg: 'https://cloud.highcharts.com/images/obulek/0/136.svg',
				tooltipText: 'Requires one column for X values or categories, subsequently one column for each series\' Y values.',
				config: {
					'chart--type': 'pyramid',
					'plotOptions-series-datalabels--color': '#000000',
					'plotOptions-series-dataLabels--softConnector': true,
					'series[0]--width': '64%'
				}
			},
			boxplot: {
				title: 'Boxplot',
				urlImg: 'https://cloud.highcharts.com/images/idagib/0/136.svg',
				tooltipText: 'Requires one column for X values, and one column each for low, lower quartile, median, upper quartile and high values.',
				config: {
					'chart--type': 'boxplot'
				}
			}

			// Issue #202 - heatmap makes no sense without proper category support
			//heatmap: {
			//	title: 'Heatmap',
			//	urlImg: 'https://cloud.highcharts.com/images/NOTREADY/0/136.svg',
			//	tooltipText: 'Requires ?? TODO',
			//	config: {
			//		'chart--type': 'heatmap',
			//		'plotOptions-series--borderWidth' : 1,
			//		'colorAxis--min' : 0
			//	}
			//},

			//speedometer: {
			//	title: 'Speedometer',
			//	config: {
			//		'chart--type': 'gauge',
			//		'chart--plotBackgroundColor': null,
			//		'chart--plotBackgroundImage': null,
			//		'chart--plotBorderwidth': 0,
			//		'chart-plotShadow': false,
			//		'pane--startAngle': -150,
			//		'pane--endAngle': 150,
			//		'yAxis--min': 0,
			//		'yAxis--max': 200,
			//		'yAxis--minorTickInterval': 'auto',
			//		'yAxis--minorTickWidth': 1,
			//		'yAxis--minorTickLength': 10,
			//		'yAxis--minorTickPosition': 'inside',
			//		'yAxis--minorTickColor': '#666',
			//		'yAxis--tickPixelInterval': 30,
			//		'yAxis--tickWidth': 2,
			//		'yAxis--tickPosition': 'inside',
			//		'yAxis--tickLength': 10,
			//		'yAxis--tickColor': '#666',
			//		'yAxis-labels--step': 2,
			//		'yAxis-labels--rotation': 'auto',
			//		'yAxis-plotBands': [{
			//			from: 0,
			//			to: 120,
			//			color: '#55BF3B' // green
			//		}, {
			//			from: 120,
			//			to: 160,
			//			color: '#DDDF0D' // yellow
			//		}, {
			//			from: 160,
			//			to: 200,
			//			color: '#DF5353' // red
			//		}]
			//	}
			//}
		}
	},
	combinations: {
		title: 'Combination charts',
		templates: {
			lineColumn: {
				title: 'Line and column',
				urlImg: 'https://cloud.highcharts.com/images/ynikoc/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'column'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values. By default, the first series is a column series and subsequent series are lines.'
			},
			columnLine: {
				title: 'Column and line',
				urlImg: 'https://cloud.highcharts.com/images/ufafag/0/136.svg',
				config: {
					'chart--type': 'column',
					'series[0]--type': 'line'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values. By default, the first series is a line series and subsequent series are columns.'
			},
			areaLine: {
				title: 'Area and line',
				urlImg: 'https://cloud.highcharts.com/images/ahimym/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'area'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values. By default, the first series is a area series and subsequent series are lines.'
			},
			scatterLine: {
				title: 'Scatter and line',
				urlImg: 'https://cloud.highcharts.com/images/etakof/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'scatter'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values. By default, the first series is a scatter series and subsequent series are lines.'
			},
			arearangeLine: {
				title: 'Arearange and line',
				urlImg: 'https://cloud.highcharts.com/images/ypepug/0/136.svg',
				config: {
					'chart--type': 'line',
					'series[0]--type': 'arearange'
				},
				tooltipText: 'Requires one data column for X values or categories, subsequently one data column for each series\' Y values. By default, the first series is a arearange series and subsequent series are lines.'
			}
		} // templates-combinations
	} 
};