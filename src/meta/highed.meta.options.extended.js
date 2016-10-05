/*

Highcharts Editor v<%= version %>

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

*/



highed.meta.optionsExtended = {
  "options": {
    "Titles": [
      {
        "text": "Main titles",
        "options": [
          {
            "text": "Chart title",
            "id": "title--text",
            "tooltipText": "The main chart title.",
            "dataType": "string",
            "context": "General",
            "defaults": "Chart title",
            "parent": "title"
          },
          {
            "text": "Chart subtitle",
            "id": "subtitle--text",
            "tooltipText": "The chart's subtitle, normally displayed with smaller fonts below the main title.",
            "dataType": "string",
            "context": "General",
            "parent": "subtitle"
          },
          {
            "text": "Y axis title",
            "id": "yAxis-title--text",
            "tooltipText": "The Y axis title, normally displayed vertically along the Y axis.",
            "dataIndex": 0,
            "dataType": "string",
            "context": "General",
            "defaults": "Values",
            "parent": "yAxis-title"
          }
        ]
      }
    ],
    "General": [
      {
        "text": "Chart size",
        "options": [
          {
            "id": "chart--width",
            "text": "Chart width",
            "custom": {
              "minValue": 0,
              "maxValue": 5000,
              "step": 10
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "An explicit width for the chart. By default (when <code>null</code>) the width is calculated from the offset width of the containing element.",
            "defaults": "null",
            "parent": "chart"
          },
          {
            "id": "chart--height",
            "text": "Chart height",
            "custom": {
              "minValue": 0,
              "maxValue": 5000,
              "step": 10
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "An explicit height for the chart. By default (when <code>null</code>) the height is calculated from the offset height of the containing element, or 400 pixels if the containing element's height is 0.",
            "defaults": "null",
            "parent": "chart"
          }
        ]
      },
      {
        "text": "Chart Interaction",
        "options": [
          {
            "id": "chart--zoomType",
            "text": "Allow zooming",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Decides in what dimensions the user can zoom by dragging the mouse. Can be one of <code>x</code>, <code>y</code> or <code>xy</code>.",
            "parent": "chart",
            "values": "[null, \"x\", \"y\", \"xy\"]"
          },
          {
            "id": "chart--polar",
            "text": "Polar (radar) projection",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "When true, cartesian charts like line, spline, area and column are transformed into the polar coordinate system. Requires <code>highcharts-more.js</code>.",
            "defaults": "false",
            "parent": "chart"
          }
        ]
      }
    ],
    "Appearance": [
      {
        "text": "Fonts",
        "options": [
          {
            "id": "chart--style",
            "text": "Font family",
            "tooltipText": "The font to use throughout the chart",
            "dataType": "cssobject",
            "context": "General",
            "defaults": "{\"fontFamily\":\"\\\"Lucida Grande\\\", \\\"Lucida Sans Unicode\\\", Verdana, Arial, Helvetica, sans-serif\",\"fontSize\":\"12px\"}",
            "parent": "chart"
          }
        ]
      },
      {
        "text": "Titles",
        "options": [
          {
            "id": "title--style",
            "text": "Main title style",
            "tooltipText": "Styling for the main chart title",
            "dataType": "cssobject",
            "context": "General",
            "defaults": "{ \"color\": \"#333333\", \"fontSize\": \"18px\" }",
            "parent": "title"
          },
          {
            "id": "subtitle--style",
            "text": "Subtitle style",
            "tooltipText": "Styling for the chart's subtitle, normally displayed with smaller fonts below the main title",
            "dataType": "cssobject",
            "context": "General",
            "defaults": "{ \"color\": \"#666666\" }",
            "parent": "subtitle"
          }
        ]
      },
      {
        "text": "Series colors",
        "options": [
          {
            "id": "colors",
            "text": "Colors",
            "tooltipText": "Default colors for the data series, or for individual points in a pie series or a column series with individual colors. Colors will be picked in succession. If a color is explicitly set for each series in the <em>Data series</em> view, that color will take precedence.",
            "dataType": "array<color>",
            "context": "General",
            "defaults": "[ \"#7cb5ec\" , \"#434348\" , \"#90ed7d\" , \"#f7a35c\" , \"#8085e9\" , \"#f15c80\" , \"#e4d354\" , \"#2b908f\" , \"#f45b5b\" , \"#91e8e1\"]"
          }
        ]
      },
      {
        "text": "Chart area",
        "options": [
          {
            "id": "chart--backgroundColor",
            "text": "Background color",
            "tooltipText": "Background color for the full chart area",
            "dataType": "color",
            "context": "General",
            "defaults": "#FFFFFF",
            "parent": "chart"
          },
          {
            "id": "chart--borderWidth",
            "text": "Border width",
            "custom": {
              "minValue": 0
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "The pixel width of the outer chart border.",
            "defaults": "0",
            "parent": "chart"
          },
          {
            "id": "chart--borderRadius",
            "text": "Border corner radius",
            "custom": {
              "minValue": 0
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "The corner radius of the outer chart border.",
            "defaults": "0",
            "parent": "chart"
          },
          {
            "id": "chart--borderColor",
            "text": "Border color",
            "dataType": "color",
            "context": "General",
            "tooltipText": "The color of the outer chart border.",
            "defaults": "#335cad",
            "parent": "chart"
          }
        ]
      },
      {
        "text": "Plot area",
        "options": [
          {
            "id": "chart--plotBackgroundColor",
            "text": "Background color",
            "tooltipText": "Background color for the plot area, the area inside the axes",
            "dataType": "color",
            "context": "General",
            "parent": "chart"
          },
          {
            "id": "chart--plotBackgroundImage",
            "text": "Background image URL",
            "tooltipText": "The online URL for an image to use as the plot area background",
            "dataType": "string",
            "context": "General",
            "parent": "chart"
          },
          {
            "id": "chart--plotBorderWidth",
            "text": "Border width",
            "dataType": "number",
            "context": "General",
            "tooltipText": "The pixel width of the plot area border.",
            "defaults": "0",
            "parent": "chart"
          },
          {
            "id": "chart--plotBorderColor",
            "text": "Border color",
            "dataType": "color",
            "context": "General",
            "tooltipText": "The color of the inner chart or plot area border.",
            "defaults": "#cccccc",
            "parent": "chart"
          }
        ]
      }
    ],
    "Axes": [
      {
        "text": "Axes setup",
        "options": [
          {
            "id": "chart--inverted",
            "text": "Inverted axes",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "<p>Whether to invert the axes so that the x axis is vertical and y axis is horizontal. When true, the x axis is <a href=\"#xAxis.reversed\">reversed</a> by default. If a bar series is present in the chart, it will be inverted automatically.</p>\r\n\r\n<p>Inverting the chart doesn't have an effect if there are no cartesian series in the chart, or if the chart is <a href=\"#chart.polar\">polar</a>.</p>",
            "defaults": "false",
            "parent": "chart"
          }
        ]
      },
      {
        "id": "xAxis",
        "text": "X-Axis",
        "options": [
          {
            "id": "xAxis-crosshair",
            "text": "Crosshair",
            "dataIndex": 0,
            "dataType": "boolean|object",
            "context": "General",
            "tooltipText": "<p>Configure a crosshair that follows either the mouse pointer or the hovered point.</p>\r\n\r\n<p>In <a href=\"http://www.highcharts.com/docs/chart-design-and-style/style-by-css\">styled mode</a>, the crosshairs are styled in the <code>.highcharts-crosshair</code>, <code>.highcharts-crosshair-thin</code> or <code>.highcharts-xaxis-category</code> classes.</p>",
            "defaults": "false",
            "parent": "xAxis",
            "attributes": [
              {
                "dataType": "string",
                "name": "className",
                "title": "className",
                "tooltipText": "A class name for the crosshair, especially as a hook for styling.",
                "defaults": "",
                "values": ""
              },
              {
                "dataType": "color",
                "name": "color",
                "title": "color",
                "tooltipText": "The color of the crosshair. Defaults to <code>#cccccc</code> for numeric and datetime axes, and <code>rgba(204,214,235,0.25)</code> for category axes, where the crosshair by default highlights the whole category."
              },
              {
                "dataType": "string",
                "name": "dashStyle",
                "title": "dashStyle",
                "tooltipText": "The dash style for the crosshair. See <a href=\"#plotOptions.series.dashStyle\">series.dashStyle</a> for possible values.",
                "defaults": "Solid",
                "values": "[\"Solid\", \"ShortDash\", \"ShortDot\", \"ShortDashDot\", \"ShortDashDotDot\", \"Dot\", \"Dash\" ,\"LongDash\", \"DashDot\", \"LongDashDot\", \"LongDashDotDot\"]"
              },
              {
                "dataType": "boolean",
                "name": "snap",
                "title": "snap",
                "tooltipText": "Whether the crosshair should snap to the point or follow the pointer independent of points.",
                "defaults": "true",
                "values": ""
              },
              {
                "dataType": "number",
                "name": "width",
                "title": "width",
                "tooltipText": "The pixel width of the crosshair. Defaults to 1 for numeric or datetime axes, and for one category width for category axes.",
                "defaults": "",
                "values": ""
              },
              {
                "dataType": "number",
                "name": "zIndex",
                "title": "zIndex",
                "tooltipText": "The Z index of the crosshair. Higher Z indices allow drawing the crosshair on top of the series or behind the grid lines.",
                "defaults": "2",
                "values": ""
              }
            ]
          },
          {
            "id": "xAxis-title--style",
            "text": "X axis title",
            "tooltipText": "Styling and text for the X axis title",
            "dataIndex": 0,
            "dataType": "cssobject",
            "context": "General",
            "defaults": "{ \"color\": \"#666666\" }",
            "parent": "xAxis-title"
          },
          {
            "id": "xAxis-title--text",
            "dataIndex": 0,
            "dataType": "string",
            "context": "General",
            "tooltipText": "The actual text of the axis title. It can contain basic HTML text markup like &lt;b&gt;, &lt;i&gt; and spans with style.",
            "parent": "xAxis-title",
            "text": "text"
          },
          {
            "id": "xAxis--type",
            "text": "Type",
            "tooltipText": "The type of axis",
            "dataIndex": 0,
            "dataType": "string",
            "context": "General",
            "defaults": "linear",
            "parent": "xAxis",
            "values": "[\"linear\", \"logarithmic\", \"datetime\", \"category\"]"
          },
          {
            "id": "xAxis--opposite",
            "text": "Opposite side of chart",
            "dataIndex": 0,
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Whether to display the axis on the opposite side of the normal. The normal is on the left side for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively. This is typically used with dual or multiple axes.",
            "defaults": "false",
            "parent": "xAxis"
          },
          {
            "id": "xAxis--reversed",
            "text": "Reversed direction",
            "dataIndex": 0,
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Whether to reverse the axis so that the highest number is closest to the origin. If the chart is inverted, the x axis is reversed by default.",
            "defaults": "false",
            "parent": "xAxis"
          },
          {
            "id": "xAxis-labels--format",
            "text": "Axis labels format",
            "tooltipText": "<p>A format string for the axis labels. The value is available through a variable <code>{value}</code>.</p><p><b>Units</b> can be added for example like <code>{value} USD</code>.</p><p><b>Formatting</b> can be added after a colon inside the variable, for example <code>USD {value:.2f}</code> to display two decimals, or <code>{value:%Y-%m-%d}</code> for a certain time format.",
            "dataIndex": 0,
            "dataType": "string",
            "context": "General",
            "defaults": "{value}",
            "parent": "xAxis-labels"
          },
          {
            "id": "xAxis-labels--rotation",
            "text": "Axis labels rotation",
            "custom": {
              "step": 5,
              "minValue": -90,
              "maxValue": 90
            },
            "dataIndex": 0,
            "dataType": "number",
            "context": "General",
            "tooltipText": "Rotation of the labels in degrees.",
            "defaults": "0",
            "parent": "xAxis-labels"
          }
        ]
      },
      {
        "id": "yAxis",
        "text": "Y-Axis",
        "options": [
          {
            "id": "yAxis-crosshair",
            "text": "Crosshair",
            "dataIndex": 0,
            "dataType": "boolean|object",
            "context": "General",
            "tooltipText": "<p>Configure a crosshair that follows either the mouse pointer or the hovered point.</p>\r\n\r\n<p>In <a href=\"http://www.highcharts.com/docs/chart-design-and-style/style-by-css\">styled mode</a>, the crosshairs are styled in the <code>.highcharts-crosshair</code>, <code>.highcharts-crosshair-thin</code> or <code>.highcharts-xaxis-category</code> classes.</p>",
            "defaults": "false",
            "parent": "yAxis",
            "attributes": [
              {
                "dataType": "string",
                "name": "className",
                "title": "className",
                "tooltipText": "A class name for the crosshair, especially as a hook for styling.",
                "defaults": "",
                "values": ""
              },
              {
                "dataType": "color",
                "name": "color",
                "title": "color",
                "tooltipText": "The color of the crosshair. Defaults to <code>#cccccc</code> for numeric and datetime axes, and <code>rgba(204,214,235,0.25)</code> for category axes, where the crosshair by default highlights the whole category."
              },
              {
                "dataType": "string",
                "name": "dashStyle",
                "title": "dashStyle",
                "tooltipText": "The dash style for the crosshair. See <a href=\"#plotOptions.series.dashStyle\">series.dashStyle</a> for possible values.",
                "defaults": "Solid",
                "values": "[\"Solid\", \"ShortDash\", \"ShortDot\", \"ShortDashDot\", \"ShortDashDotDot\", \"Dot\", \"Dash\" ,\"LongDash\", \"DashDot\", \"LongDashDot\", \"LongDashDotDot\"]"
              },
              {
                "dataType": "boolean",
                "name": "snap",
                "title": "snap",
                "tooltipText": "Whether the crosshair should snap to the point or follow the pointer independent of points.",
                "defaults": "true",
                "values": ""
              },
              {
                "dataType": "number",
                "name": "width",
                "title": "width",
                "tooltipText": "The pixel width of the crosshair. Defaults to 1 for numeric or datetime axes, and for one category width for category axes.",
                "defaults": "",
                "values": ""
              },
              {
                "dataType": "number",
                "name": "zIndex",
                "title": "zIndex",
                "tooltipText": "The Z index of the crosshair. Higher Z indices allow drawing the crosshair on top of the series or behind the grid lines.",
                "defaults": "2",
                "values": ""
              }
            ]
          },
          {
            "id": "yAxis-title--style",
            "text": "Y axis title",
            "tooltipText": "Styling and text for the X axis title",
            "dataIndex": 0,
            "dataType": "cssobject",
            "context": "General",
            "defaults": "{ \"color\": \"#666666\" }",
            "parent": "yAxis-title"
          },
          {
            "id": "yAxis--type",
            "text": "Type",
            "tooltipText": "The type of axis",
            "dataIndex": 0,
            "dataType": "string",
            "context": "General",
            "defaults": "linear",
            "parent": "yAxis",
            "values": "[\"linear\", \"logarithmic\", \"datetime\", \"category\"]"
          },
          {
            "id": "yAxis--opposite",
            "text": "Opposite side of chart",
            "dataIndex": 0,
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Whether to display the axis on the opposite side of the normal. The normal is on the left side for vertical axes and bottom for horizontal, so the opposite sides will be right and top respectively. This is typically used with dual or multiple axes.",
            "defaults": "false",
            "parent": "yAxis"
          },
          {
            "id": "yAxis--reversed",
            "text": "Reversed direction",
            "dataIndex": 0,
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Whether to reverse the axis so that the highest number is closest to the origin. If the chart is inverted, the x axis is reversed by default.",
            "defaults": "false",
            "parent": "yAxis"
          }
        ]
      }
    ],
    "Data series": [
      {
        "id": "series",
        "array": true,
        "text": "Series",
        "controlledBy": {
          "title": "Select Series",
          "options": "series",
          "optionsTitle": "name"
        },
        "filteredBy": "series--type",
        "options": [
          {
            "id": "series--type",
            "text": "Series type",
            "tooltipText": "The type of series",
            "dataType": "string",
            "context": "General",
            "parent": "series",
            "values": "[null, \"line\", \"spline\", \"column\", \"area\", \"areaspline\", \"pie\", \"arearange\", \"areasplinerange\", \"boxplot\", \"bubble\", \"columnrange\", \"errorbar\", \"funnel\", \"gauge\", \"scatter\", \"waterfall\"]",
            "subType": [
              "scatter",
              "arearange",
              "columnrange",
              "areaspline",
              "bar",
              "errorbar",
              "bubble",
              "gauge",
              "line",
              "polygon",
              "waterfall",
              "heatmap",
              "spline",
              "boxplot",
              "column",
              "pie",
              "areasplinerange",
              "area",
              "funnel",
              "treemap",
              "pyramid",
              "solidgauge"
            ],
            "subTypeDefaults": {}
          },
          {
            "id": "series--color",
            "text": "Color",
            "tooltipText": "The main color of the series. If no color is given here, the color is pulled from the array of default colors as given in the \"Appearance\" section.",
            "dataType": "color",
            "context": "General",
            "defaults": "null",
            "parent": "series<scatter>",
            "subType": [
              "scatter",
              "gauge",
              "heatmap",
              "line",
              "spline",
              "areaspline",
              "bubble",
              "area",
              "waterfall",
              "boxplot",
              "arearange",
              "bar",
              "errorbar",
              "areasplinerange",
              "column",
              "columnrange",
              "treemap",
              "polygon"
            ],
            "subTypeDefaults": {
              "heatmap": "null",
              "errorbar": "#000000",
              "treemap": "null"
            }
          },
          {
            "id": "series--negativeColor",
            "text": "Negative color",
            "tooltipText": "The negative color of the series below the threshold. Threshold is default zero, this can be changed in the advanced settings.",
            "dataType": "color",
            "context": "General",
            "defaults": "null",
            "parent": "series<spline>",
            "subType": [
              "spline",
              "areasplinerange",
              "column",
              "polygon",
              "line",
              "bubble",
              "areaspline",
              "scatter",
              "bar",
              "arearange",
              "area",
              "boxplot",
              "gauge",
              "errorbar"
            ],
            "subTypeDefaults": {
              "areasplinerange": "null",
              "column": "null",
              "polygon": "null",
              "line": "null",
              "bubble": "null",
              "areaspline": "null",
              "scatter": "null",
              "bar": "null",
              "arearange": "null",
              "area": "null",
              "boxplot": "null",
              "gauge": "null",
              "errorbar": "null"
            }
          },
          {
            "id": "series--colorByPoint",
            "text": "Color by point",
            "tooltipText": "Use one color per point. Colors can be changed in the \"Appearance\" section.",
            "dataType": "boolean",
            "context": "General",
            "defaults": "false",
            "parent": "series<waterfall>",
            "subType": [
              "waterfall",
              "treemap",
              "column",
              "columnrange",
              "errorbar",
              "boxplot",
              "heatmap",
              "bar"
            ],
            "subTypeDefaults": {
              "treemap": "false",
              "column": "false",
              "columnrange": "false",
              "errorbar": "false",
              "boxplot": "false",
              "heatmap": "false",
              "bar": "false"
            }
          },
          {
            "id": "series--dashStyle",
            "text": "Dash style",
            "dataType": "string",
            "context": "General",
            "tooltipText": "A name for the dash style to use for the graph. Applies only to series type having a graph, like <code>line</code>, <code>spline</code>, <code>area</code> and <code>scatter</code> in  case it has a <code>lineWidth</code>. The value for the <code>dashStyle</code> include:\r\n\t\t    <ul>\r\n\t\t    \t<li>Solid</li>\r\n\t\t    \t<li>ShortDash</li>\r\n\t\t    \t<li>ShortDot</li>\r\n\t\t    \t<li>ShortDashDot</li>\r\n\t\t    \t<li>ShortDashDotDot</li>\r\n\t\t    \t<li>Dot</li>\r\n\t\t    \t<li>Dash</li>\r\n\t\t    \t<li>LongDash</li>\r\n\t\t    \t<li>DashDot</li>\r\n\t\t    \t<li>LongDashDot</li>\r\n\t\t    \t<li>LongDashDotDot</li>\r\n\t\t    </ul>",
            "defaults": "Solid",
            "parent": "series<polygon>",
            "values": "[\"Solid\", \"ShortDash\", \"ShortDot\", \"ShortDashDot\", \"ShortDashDotDot\", \"Dot\", \"Dash\" ,\"LongDash\", \"DashDot\", \"LongDashDot\", \"LongDashDotDot\"]",
            "subType": [
              "polygon",
              "line",
              "waterfall",
              "bubble",
              "areaspline",
              "scatter",
              "area",
              "spline",
              "arearange",
              "areasplinerange"
            ],
            "subTypeDefaults": {
              "line": "Solid",
              "waterfall": "Dot",
              "bubble": "Solid",
              "areaspline": "Solid",
              "scatter": "Solid",
              "area": "Solid",
              "spline": "Solid",
              "arearange": "Solid",
              "areasplinerange": "Solid"
            }
          },
          {
            "id": "series-marker--enabled",
            "text": "Enable point markers",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Enable or disable the point marker. If <code>null</code>, the markers are hidden when the data is dense, and shown for more widespread data points.",
            "defaults": "null",
            "parent": "series<area>-marker",
            "subType": [
              "area",
              "bubble",
              "line",
              "spline",
              "areaspline",
              "polygon",
              "scatter"
            ],
            "subTypeDefaults": {
              "bubble": "null",
              "line": "null",
              "spline": "null",
              "areaspline": "null",
              "polygon": "null",
              "scatter": "null"
            }
          },
          {
            "id": "series-marker--symbol",
            "text": "Marker symbol",
            "dataType": "string",
            "context": "General",
            "tooltipText": "<p>A predefined shape or symbol for the marker. When null, the symbol is pulled from options.symbols. Other possible values are \"circle\", \"square\", \"diamond\", \"triangle\" and \"triangle-down\".</p>\r\n\r\n<p>Additionally, the URL to a graphic can be given on this form:  \"url(graphic.png)\". Note that for the image to be applied to exported charts, its URL needs to be accessible by the export server.</p>\r\n\r\n<p>Custom callbacks for symbol path generation can also be added to <code>Highcharts.SVGRenderer.prototype.symbols</code>. The callback is then used by its method name, as shown in the demo.</p>",
            "parent": "series<area>-marker",
            "values": "[null, \"circle\", \"square\", \"diamond\", \"triangle\", \"triangle-down\"]",
            "subType": [
              "area",
              "polygon",
              "areaspline",
              "spline",
              "bubble",
              "line",
              "scatter"
            ],
            "subTypeDefaults": {}
          }
        ]
      }
    ],
    "Value labels": [
      {
        "id": "data-labels",
        "text": "Value labels",
        "options": [
          {
            "id": "plotOptions-series-dataLabels--enabled",
            "text": "Enable data labels for all series",
            "tooltipText": "Show small labels next to each data value (point, column, pie slice etc)",
            "dataType": "boolean",
            "context": "General",
            "defaults": "false",
            "parent": "plotOptions-series-dataLabels"
          },
          {
            "id": "plotOptions-series-dataLabels--style",
            "text": "Text style",
            "dataType": "cssobject",
            "context": "General",
            "tooltipText": "Styles for the label.",
            "defaults": "{\"color\": \"contrast\", \"fontSize\": \"11px\", \"fontWeight\": \"bold\", \"textShadow\": \"1px 1px contrast, -1px -1px contrast, -1px 1px contrast, 1px -1px contrast\" }",
            "parent": "plotOptions-series-dataLabels"
          }
        ]
      }
    ],
    "Legend": [
      {
        "text": "General",
        "options": [
          {
            "id": "legend--enabled",
            "text": "Enable legend",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "Enable or disable the legend.",
            "defaults": "true",
            "parent": "legend"
          },
          {
            "id": "legend--layout",
            "text": "Item layout",
            "dataType": "string",
            "context": "General",
            "tooltipText": "The layout of the legend items. Can be one of \"horizontal\" or \"vertical\".",
            "defaults": "horizontal",
            "parent": "legend",
            "values": "[\"horizontal\", \"vertical\"]"
          }
        ]
      },
      {
        "text": "Placement",
        "options": [
          {
            "id": "legend--align",
            "text": "Horizontal alignment",
            "dataType": "string",
            "context": "General",
            "tooltipText": "<p>The horizontal alignment of the legend box within the chart area. Valid values are <code>left</code>, <code>center</code> and <code>right</code>.</p>\r\n\r\n<p>In the case that the legend is aligned in a corner position, the <code>layout</code> option will determine whether to place it above/below or on the side of the plot area.</p>",
            "defaults": "center",
            "parent": "legend",
            "values": "[\"left\", \"center\", \"right\"]"
          },
          {
            "id": "legend--x",
            "text": "Horizontal offset",
            "tooltipText": "The pixel offset of the legend relative to its alignment",
            "dataType": "number",
            "context": "General",
            "defaults": "0",
            "parent": "legend"
          },
          {
            "id": "legend--verticalAlign",
            "text": "Vertical alignment",
            "dataType": "string",
            "context": "General",
            "tooltipText": "<p>The vertical alignment of the legend box. Can be one of <code>top</code>, <code>middle</code> or  <code>bottom</code>. Vertical position can be further determined by the <code>y</code> option.</p>\r\n\r\n<p>In the case that the legend is aligned in a corner position, the <code>layout</code> option will determine whether to place it above/below or on the side of the plot area.</p>",
            "defaults": "bottom",
            "parent": "legend",
            "values": "[\"top\", \"middle\", \"bottom\"]"
          },
          {
            "id": "legend--y",
            "text": "Vertical offset",
            "tooltipText": "The pixel offset of the legend relative to its alignment",
            "dataType": "number",
            "context": "General",
            "defaults": "0",
            "parent": "legend"
          },
          {
            "id": "legend--floating",
            "text": "Float on top of plot area",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "When the legend is floating, the plot area ignores it and is allowed to be placed below it.",
            "defaults": "false",
            "parent": "legend"
          }
        ]
      },
      {
        "text": "Appearance",
        "options": [
          {
            "id": "legend--itemStyle",
            "text": "Text style",
            "dataType": "cssobject",
            "context": "General",
            "tooltipText": "CSS styles for each legend item. Only a subset of CSS is supported, notably those options related to text.",
            "defaults": "{ \"color\": \"#333333\", \"cursor\": \"pointer\", \"fontSize\": \"12px\", \"fontWeight\": \"bold\" }",
            "parent": "legend"
          },
          {
            "id": "legend--itemHiddenStyle",
            "text": "Text style hidden",
            "dataType": "cssobject",
            "context": "General",
            "tooltipText": "CSS styles for each legend item when the corresponding series or point is hidden. Only a subset of CSS is supported, notably those options related to text. Properties are inherited from <code>style</code> unless overridden here.",
            "defaults": "{ \"color\": \"#cccccc\" }",
            "parent": "legend"
          },
          {
            "id": "legend--backgroundColor",
            "text": "Background color",
            "dataType": "color",
            "context": "General",
            "tooltipText": "The background color of the legend.",
            "parent": "legend"
          },
          {
            "id": "legend--borderWidth",
            "text": "Border width",
            "dataType": "number",
            "context": "General",
            "tooltipText": "The width of the drawn border around the legend.",
            "defaults": "0",
            "parent": "legend"
          },
          {
            "id": "legend--borderRadius",
            "text": "Border corner radius",
            "dataType": "number",
            "context": "General",
            "tooltipText": "The border corner radius of the legend.",
            "defaults": "0",
            "parent": "legend"
          },
          {
            "id": "legend--borderColor",
            "text": "Border color",
            "dataType": "color",
            "context": "General",
            "tooltipText": "The color of the drawn border around the legend.",
            "defaults": "#999999",
            "parent": "legend"
          }
        ]
      }
    ],
    "Tooltip": [
      {
        "text": "General",
        "options": [
          {
            "id": "tooltip--enabled",
            "text": "Enable tooltip",
            "tooltipText": "Enable or disable the tooltip. The tooltip is the information box that appears on mouse-over or touch on a point.",
            "dataType": "boolean",
            "context": "General",
            "defaults": "true",
            "parent": "tooltip"
          },
          {
            "id": "tooltip--shared",
            "text": "Shared between series",
            "dataType": "boolean",
            "context": "General",
            "tooltipText": "<p>When the tooltip is shared, the entire plot area will capture mouse movement or touch events. Tooltip texts for series types with ordered data (not pie, scatter, flags etc) will be shown in a single bubble. This is recommended for single series charts and for tablet/mobile optimized charts.</p>\r\n\r\n<p>See also the experimental implementation for <a href=\"http://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/highcharts/studies/tooltip-split/\">tooltip.split</a>, that is better suited for charts with many series, especially line-type series.</p>",
            "defaults": "false",
            "parent": "tooltip"
          }
        ]
      },
      {
        "text": "Color and border",
        "options": [
          {
            "id": "tooltip--backgroundColor",
            "text": "Background color",
            "tooltipText": "The background color of the tooltip",
            "dataType": "color",
            "context": "General",
            "defaults": "rgba(247,247,247,0.85)",
            "parent": "tooltip"
          },
          {
            "id": "tooltip--borderWidth",
            "text": "Border width",
            "custom": {
              "minValue": 0
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "<p>The pixel width of the tooltip border.</p>\r\n\r\n<p>In <a href=\"http://www.highcharts.com/docs/chart-design-and-style/style-by-css\">styled mode</a>, the stroke width is set in the <code>.highcharts-tooltip-box</code> class.</p>",
            "defaults": "1",
            "parent": "tooltip"
          },
          {
            "id": "tooltip--borderRadius",
            "text": "Border corner radius",
            "custom": {
              "minValue": 0
            },
            "dataType": "number",
            "context": "General",
            "tooltipText": "The radius of the rounded border corners.",
            "defaults": "3",
            "parent": "tooltip"
          },
          {
            "id": "tooltip--borderColor",
            "text": "Border color",
            "tooltipText": "The border color of the tooltip. If no color is given, the corresponding series color is used.",
            "dataType": "color",
            "context": "General",
            "defaults": "null",
            "parent": "tooltip"
          }
        ]
      }
    ],
    "Exporting": [
      {
        "text": "Exporting",
        "options": [
          {
            "id": "exporting--enabled",
            "text": "Enable exporting",
            "tooltipText": "Enable the context button on the top right of the chart, allowing end users to download image exports.",
            "dataType": "boolean",
            "context": "General",
            "defaults": "true",
            "parent": "exporting"
          },
          {
            "id": "exporting--sourceWidth",
            "text": "Exported width",
            "tooltipText": "The width of the original chart when exported. The pixel width of the exported image is then multiplied by the <em>Scaling factor</em>.",
            "custom": {
              "minValue": 10,
              "maxValue": 2000,
              "step": 10
            },
            "dataType": "number",
            "context": "General",
            "parent": "exporting",
            "values": ""
          },
          {
            "id": "exporting--scale",
            "text": "Scaling factor",
            "tooltipText": "The export scale. Note that this is overridden if width is set.",
            "custom": {
              "minValue": 1,
              "maxValue": 4
            },
            "dataType": "number",
            "context": "General",
            "defaults": "2",
            "parent": "exporting",
            "values": ""
          }
        ]
      }
    ],
    "Localization": [
      {
        "text": "Number formatting",
        "options": [
          {
            "id": "lang--decimalPoint",
            "text": "Decimal point",
            "tooltipText": "The decimal point used for all numbers",
            "dataType": "string",
            "context": "General",
            "defaults": ".",
            "parent": "lang"
          },
          {
            "id": "lang--thousandsSep",
            "text": "Thousands separator",
            "tooltipText": "The thousands separator used for all numbers",
            "dataType": "string",
            "context": "General",
            "defaults": " ",
            "parent": "lang"
          }
        ]
      },
      {
        "text": "Exporting button and menu",
        "options": [
          {
            "id": "lang--contextButtonTitle",
            "text": "Context button title",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module menu. The tooltip title for the context menu holding print and export menu items.",
            "defaults": "Chart context menu",
            "parent": "lang",
            "values": ""
          },
          {
            "id": "lang--printChart",
            "text": "Print chart",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module only. The text for the menu item to print the chart.",
            "defaults": "Print chart",
            "parent": "lang",
            "values": ""
          },
          {
            "id": "lang--downloadPNG",
            "text": "Download PNG",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module only. The text for the PNG download menu item.",
            "defaults": "Download PNG image",
            "parent": "lang"
          },
          {
            "id": "lang--downloadJPEG",
            "text": "Download JPEG",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module only. The text for the JPEG download menu item.",
            "defaults": "Download JPEG image",
            "parent": "lang"
          },
          {
            "id": "lang--downloadPDF",
            "text": "Download PDF",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module only. The text for the PDF download menu item.",
            "defaults": "Download PDF document",
            "parent": "lang"
          },
          {
            "id": "lang--downloadSVG",
            "text": "Download SVG",
            "dataType": "string",
            "context": "General",
            "tooltipText": "Exporting module only. The text for the SVG download menu item.",
            "defaults": "Download SVG vector image",
            "parent": "lang"
          }
        ]
      },
      {
        "text": "Zoom button",
        "options": [
          {
            "id": "lang--resetZoom",
            "text": "Reset zoom button",
            "dataType": "string",
            "context": "General",
            "tooltipText": "The text for the label appearing when a chart is zoomed.",
            "defaults": "Reset zoom",
            "parent": "lang"
          }
        ]
      }
    ],
    "Credits": [
      {
        "text": "Chart credits (Requires license)",
        "options": [
          {
            "id": "credits--enabled",
            "text": "Enable credits",
            "tooltipText": "Whether to show the credits text",
            "dataType": "boolean",
            "context": "General",
            "defaults": "true",
            "parent": "credits"
          },
          {
            "id": "credits--text",
            "text": "Credits text",
            "tooltipText": "The text for the credits label",
            "dataType": "string",
            "context": "General",
            "defaults": "Highcharts.com",
            "parent": "credits"
          },
          {
            "id": "credits--href",
            "text": "Link",
            "tooltipText": "The URL for the credits label",
            "dataType": "string",
            "context": "General",
            "defaults": "http://www.highcharts.com",
            "parent": "credits"
          }
        ]
      }
    ]
  }
};