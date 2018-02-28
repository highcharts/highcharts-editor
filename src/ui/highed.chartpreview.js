/******************************************************************************

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

******************************************************************************/

// @format

/** Basic chart preview
 *  This is just a facade to Highcharts.Chart mostly.
 *  It implements a sliding drawer type widget,
 *  where the initial state can be as part of the main DOM,
 *  and where the expanded state covers most of the screen (90%)
 *
 *  @todo this is a proper mess right now - need a good refactoring
 *
 *  @constructor
 *
 *  @param parent {domnode} - the node to attach the preview to
 *  @param attributes {object} - the settings
 *    > defaultChartOptions {object} - the default chart options
 */
highed.ChartPreview = function(parent, attributes) {
  var properties = highed.merge(
      {
        defaultChartOptions: {
          title: {
            text: 'My Chart'
          },
          subtitle: {
            text: 'My Untitled Chart'
          },
          exporting: {
            //   url: 'http://127.0.0.1:7801'
          }
        },
        expandTo: parent
      },
      attributes
    ),
    events = highed.events(),
    customizedOptions = highed.merge({}, properties.defaultChartOptions),
    aggregatedOptions = {},
    flatOptions = {},
    templateOptions = {},
    chartOptions = {},
    themeOptions = {},
    themeMeta = {},
    exports = {},
    customCodeDefault = [
      '/*',
      '// Sample of extending options:',
      'Highcharts.merge(true, options, {',
      '    chart: {',
      '        backgroundColor: "#bada55"',
      '    },',
      '    plotOptions: {',
      '        series: {',
      '            cursor: "pointer",',
      '            events: {',
      '                click: function(event) {',
      '                    alert(this.name + " clicked\\n" +',
      '                          "Alt: " + event.altKey + "\\n" +',
      '                          "Control: " + event.ctrlKey + "\\n" +',
      '                          "Shift: " + event.shiftKey + "\\n");',
      '                }',
      '            }',
      '        }',
      '    }',
      '});',
      '*/'
    ].join('\n'),
    customCode = '',
    customCodeStr = '',
    lastLoadedCSV = false,
    lastLoadedSheet = false,
    throttleTimeout = false,
    chart = false,
    preExpandSize = false,
    toggleButton = highed.dom.cr(
      'div',
      'highed-icon highed-chart-preview-expand fa fa-external-link-square'
    ),
    expanded = false,
    constr = 'Chart',
    wysiwyg = {
      'g.highcharts-legend': { tab: 'Legend', id: 'legend--enabled' },
      'text.highcharts-title': { tab: 'Titles', id: 'title--text' },
      'text.highcharts-subtitle': { tab: 'Titles', id: 'subtitle--text' },
      '.highcharts-yaxis-labels': { tab: 'Axes', id: 'yAxis-labels--format' },
      '.highcharts-xaxis-labels': { tab: 'Axes', id: 'xAxis-labels--format' },
      '.highcharts-xaxis .highcharts-axis-title': {
        tab: 'Axes',
        id: 'xAxis-title--text'
      },
      '.highcharts-yaxis .highcharts-axis-title': {
        tab: 'Titles',
        id: 'yAxis-title--text'
      },
      'rect.highcharts-background': {
        tab: 'Appearance',
        id: 'chart--backgroundColor'
      },
      '.highcharts-series': { tab: 'Data series', id: 'series' },
      'g.highcharts-tooltip': { tab: 'Tooltip', id: 'tooltip--enabled' }
    };

  ///////////////////////////////////////////////////////////////////////////

  function attachWYSIWYG() {
    Object.keys(wysiwyg).forEach(function(key) {
      highed.dom.on(parent.querySelector(key), 'click', function(e) {
        events.emit('RequestEdit', wysiwyg[key], e.clientX, e.clientY);
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      });
    });
  }

  function stringifyFn(obj, tabs) {
    return JSON.stringify(
      obj,
      function(key, value) {
        if (highed.isFn(value)) {
          return value.toString();
        }

        return value;
      },
      tabs
    );
  }

  /* Get the chart if it's initied */
  function gc(fn) {
    if (highed.isFn(fn)) {
      if (chart !== false) {
        return fn(chart);
      }
      return fn(init());
    }
    return false;
  }

  /* Emit change events */
  function emitChange() {
    events.emit('ChartChange', aggregatedOptions);

    //Throttled event - we use this when doing server stuff in the handler
    //since e.g. using the color picker can result in quite a lot of updates
    //within a short amount of time
    window.clearTimeout(throttleTimeout);
    throttleTimeout = window.setTimeout(function() {
      events.emit('ChartChangeLately', aggregatedOptions);
    }, 200);
  }

  /* Init the chart */
  function init(options, pnode, noAnimation) {
    var i;

    //We want to work on a copy..
    options = options || aggregatedOptions;
    constr = constr || 'Chart';
    // options = highed.merge({}, options || aggregatedOptions);

    // if (aggregatedOptions && aggregatedOptions.series) {
    //     options = aggregatedOptions.series;
    // }

    if (noAnimation) {
      highed.setAttr(options, 'plotOptions--series--animation', false);
    }

    if (typeof window.Highcharts === 'undefined') {
      highed.snackBar('Highcharts.JS must be included to use the editor');
      return;
    }

    // options.chart = options.chart || {};
    // options.chart.width = '100%';
    // options.chart.height = '100%';

    // if (options && options.chart) {
    //   delete options.chart.width;
    //   delete options.chart.height;
    // }

    try {
      chart = new Highcharts[constr](pnode || parent, options);
      //This is super ugly.
      // customizedOptions.series = customizedOptions.series || [];
      //  customizedOptions.series = chart.options.series || [];
      // highed.merge(customizedOptions.series, chart.options.series);
      //updateAggregated();

      if (chart && chart.options) {
        highed.clearObj(chartOptions);
        highed.merge(chartOptions, chart.options);
      }

      attachWYSIWYG();

      if (chart && chart.reflow) {
        //chart.reflow();
      }

      // highed.dom.ap(pnode || parent, toggleButton);

      Highcharts.addEvent(chart, 'afterPrint', function() {
        events.emit('RequestResize');
        // highed.dom.ap(pnode || parent, toggleButton);
      });
    } catch (ex) {
      var e = ex.toString();

      //So we know that the return here is likely to be an
      //url with the error code. so extract it.
      highed.log(1, 'error initializing chart:', e);

      i = e.indexOf('www.');

      if (i > 0) {
        highed.snackBar(
          'There is a problem with your chart!',
          e.substr(i),
          function() {
            window.open('http://' + e.substr(i));
          }
        );
      } else {
        //Our assumption was wrong. The world is ending.
        highed.snackBar(e);

        console.error(e);
        console.error('exception trace:', ex.stack);
      }

      chart = false;
    }

    return chart;
  }

  /** Resize the preview
   *  Resizes based on the parent size.
   *  @memberof highed.ChartPreview
   */
  function resize(width, height) {
    gc(function(chart) {
      if (width && height) {
        // chart.setSize(width, height);
      }

      if (chart.reflow) {
        chart.reflow();
      }
    });
  }

  /**
   * Assign a theme to the chart
   * theme can either be a straight-up option set, or a theme object with
   * ID and so on.
   */
  function assignTheme(theme, skipEmit) {
    if (highed.isStr(theme)) {
      return assignTheme(JSON.parse(theme));
    }

    themeMeta = {};

    if (highed.isBasic(theme) || highed.isArr(theme)) {
      return false;
    }

    if (Object.keys(theme).length === 0) {
      return false;
    }

    if (theme && theme.options && theme.id) {
      // Assume that this uses the new format
      themeMeta = {
        id: theme.id,
        name: theme.name || theme.id
      };

      themeOptions = highed.merge({}, theme.options);
    } else {
      themeMeta = {
        id: highed.uuid(),
        name: 'Untitled Theme'
      };

      themeOptions = highed.merge({}, theme);
    }

    if (!skipEmit) {
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    }

    return true;
  }

  function updateAggregated(noCustomCode) {
    // customizedOptions.plotOptions = customizedOptions.plotOptions || {};
    // customizedOptions.plotOptions.series = customizedOptions.plotOptions.series || [];
    //  customizedOptions.series = customizedOptions.series || [];

    if (
      customizedOptions &&
      !highed.isArr(customizedOptions.yAxis) &&
      customizedOptions.yAxis
    ) {
      customizedOptions.yAxis = [customizedOptions.yAxis || {}];
    }

    if (
      customizedOptions &&
      !highed.isArr(customizedOptions.xAxis) &&
      customizedOptions.xAxis
    ) {
      customizedOptions.xAxis = [customizedOptions.xAxis || {}];
    }

    templateOptions = templateOptions || {};

    if (templateOptions.yAxis && !highed.isArr(templateOptions.yAxis)) {
      templateOptions.yAxis = [templateOptions.yAxis];
    }

    if (templateOptions.xAxis && !highed.isArr(templateOptions.xAxis)) {
      templateOptions.xAxis = [templateOptions.xAxis];
    }

    // if (templateOptions.series) {
    //     templateOptions.series = templateOptions.series.map(function (s) {
    //         delete s['data'];
    //         return s;
    //     });
    // }

    //Merge fest

    highed.clearObj(aggregatedOptions);

    // Apply theme first
    if (themeOptions && Object.keys(themeOptions).length) {
      highed.merge(
        aggregatedOptions,
        highed.merge(highed.merge({}, themeOptions))
      );
    }

    highed.merge(
      aggregatedOptions,
      highed.merge(highed.merge({}, templateOptions), customizedOptions)
    );

    //This needs to be cleaned up
    if (aggregatedOptions.yAxis && templateOptions.yAxis) {
      aggregatedOptions.yAxis.forEach(function(obj, i) {
        if (i < templateOptions.yAxis.length) {
          highed.merge(obj, templateOptions.yAxis[i]);
        }
      });
    }

    if (aggregatedOptions.xAxis && templateOptions.xAxis) {
      aggregatedOptions.xAxis.forEach(function(obj, i) {
        if (i < templateOptions.xAxis.length) {
          highed.merge(obj, templateOptions.xAxis[i]);
        }
      });
    }

    if (themeOptions && themeOptions.xAxis) {
      themeOptions.xAxis = highed.isArr(themeOptions.xAxis)
        ? themeOptions.xAxis
        : [themeOptions.xAxis];

      aggregatedOptions.xAxis.forEach(function(obj, i) {
        if (i < themeOptions.xAxis.length) {
          highed.merge(obj, themeOptions.xAxis[i]);
        }
      });
    }

    if (themeOptions && themeOptions.yAxis) {
      themeOptions.yAxis = highed.isArr(themeOptions.yAxis)
        ? themeOptions.yAxis
        : [themeOptions.yAxis];

      aggregatedOptions.yAxis.forEach(function(obj, i) {
        if (i < themeOptions.yAxis.length) {
          highed.merge(obj, themeOptions.yAxis[i]);
        }
      });
    }

    //Temporary hack
    //aggregatedOptions.series = customizedOptions.series;\
    aggregatedOptions.series = [];
    if (highed.isArr(customizedOptions.series)) {
      customizedOptions.series.forEach(function(obj, i) {
        var mergeTarget = {};

        if (themeOptions && highed.isArr(themeOptions.series)) {
          if (i < themeOptions.series.length) {
            mergeTarget = highed.merge({}, themeOptions.series[i]);
          }
        }

        aggregatedOptions.series.push(highed.merge(mergeTarget, obj));
      });
    }

    if (templateOptions.series) {
      aggregatedOptions.series = aggregatedOptions.series || [];

      templateOptions.series.forEach(function(obj, i) {
        if (i < aggregatedOptions.series.length) {
          highed.merge(aggregatedOptions.series[i], obj);
        } else {
          aggregatedOptions.series.push(highed.merge({}, obj));
        }
      });
    }

    if (aggregatedOptions.yAxis && !highed.isArr(aggregatedOptions.yAxis)) {
      aggregatedOptions.yAxis = [aggregatedOptions.yAxis];
    }

    if (aggregatedOptions.xAxis && !highed.isArr(aggregatedOptions.xAxis)) {
      aggregatedOptions.xAxis = [aggregatedOptions.xAxis];
    }

    highed.merge(aggregatedOptions, highed.option('stickyChartProperties'));

    // Finally, do custom code
    if (!noCustomCode && highed.isFn(customCode)) {
      customCode(aggregatedOptions);
    }
  }

  /** Load a template from the meta
   *  @memberof highed.ChartPreview
   *  @param template - the template object
   */
  function loadTemplate(template) {
    if (!template || !template.config) {
      return highed.log(
        1,
        'chart preview: templates must be an object {config: {...}}'
      );
    }

    constr = template.constructor || 'Chart';

    highed.clearObj(templateOptions);

    if (customizedOptions.xAxis) {
      delete customizedOptions.xAxis;
    }

    if (customizedOptions.yAxis) {
      delete customizedOptions.yAxis;
    }

    // highed.setAttr(customizedOptions, 'series', []);

    gc(function(chart) {
      templateOptions = highed.merge({}, template.config || {});

      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    });
  }

  function loadSeries() {
    if (
      !gc(function(chart) {
        if (chart.options && chart.options.series) {
          customizedOptions.series = chart.options.series;
        }
        return true;
      })
    ) {
      customizedOptions.series = [];
    }
    updateAggregated();
  }

  /** Load CSV data
   *  @memberof highed.ChartPreview
   *  @name data.csv
   *  @param data {object} - the data to load
   */
  function loadCSVData(data) {
    var mergedExisting = false,
      seriesClones = [];

    if (!data || !data.csv) {
      if (highed.isStr(data)) {
        data = {
          csv: data,
          // itemDelimiter: ';',
          firstRowAsNames: true
        };
      } else {
        return highed.log(1, 'chart load csv: data.csv is required');
      }
    }

    lastLoadedCSV = data.csv;
    lastLoadedSheet = false;

    gc(function(chart) {
      var axis;

      // highed.setAttr(customizedOptions, 'series', []);
      // highed.setAttr(aggregatedOptions, 'series', []);

      // highed.setAttr(customizedOptions, 'plotOptions--series--animation', true);
      // highed.setAttr(customizedOptions, 'data--csv', data.csv);
      // highed.setAttr(customizedOptions, 'data--googleSpreadsheetKey', undefined);
      // highed.setAttr(customizedOptions, 'data--itemDelimiter', data.itemDelimiter);
      // highed.setAttr(customizedOptions, 'data--firstRowAsNames', data.firstRowAsNames);
      // highed.setAttr(customizedOptions, 'data--dateFormat', data.dateFormat);
      // highed.setAttr(customizedOptions, 'data--decimalPoint', data.decimalPoint);

      if (customizedOptions && customizedOptions.series) {
        (highed.isArr(customizedOptions.series)
          ? customizedOptions.series
          : [customizedOptions.series]
        ).forEach(function(series) {
          seriesClones.push(
            highed.merge({}, series, false, {
              data: 1,
              name: 1
            })
          );
        });
      }

      customizedOptions.series = [];

      highed.merge(customizedOptions, {
        plotOptions: {
          series: {
            animation: false
          }
        },
        data: {
          csv: data.csv,
          itemDelimiter: data.itemDelimiter,
          firstRowAsNames: data.firstRowAsNames,
          dateFormat: data.dateFormat,
          decimalPoint: data.decimalPoint,
          googleSpreadsheetKey: undefined
        }
      });

      updateAggregated();

      init(aggregatedOptions);
      loadSeries();
      emitChange();

      (customizedOptions.series || []).forEach(function(series, i) {
        if (i < seriesClones.length) {
          mergedExisting = true;
          highed.merge(series, seriesClones[i]);
        }
      });

      if (mergedExisting) {
        updateAggregated();
        init(aggregatedOptions);
        loadSeries();
        emitChange();
      }
    });

    // setTimeout(function () {
    // gc(function (chart) {
    //   if (chart && highed.isArr(chart.xAxis) && chart.xAxis.length > 0) {
    //     customizedOptions.xAxis = customizedOptions.xAxis || [];
    //     chart.xAxis.forEach(function (a, i) {
    //       customizedOptions.xAxis[i] = customizedOptions.xAxis[i] || {};
    //       if (a.isDatetimeAxis) {
    //         customizedOptions.xAxis[i].type = 'datetime';
    //       } else if (a.categories) {
    //         customizedOptions.xAxis[i].type = 'categories';
    //       } else {
    //         // customizedOptions.xAxis[i].type = 'linear';
    //       }
    //     });
    //   }
    //   console.log(chart);
    // });
    // }, 1000);
  }

  /** Load project
   *  @memberof highed.ChartPreview
   *  @param projectData - the data to load
   */
  function loadProject(projectData) {
    var hasData = false,
      htmlEntities = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>'
      };

    lastLoadedCSV = false;
    lastLoadedSheet = false;

    if (highed.isStr(projectData)) {
      try {
        return loadProject(JSON.parse(projectData));
      } catch (e) {
        highed.snackBar('Invalid project');
      }
    }

    if (projectData) {
      templateOptions = {};
      if (projectData.template) {
        templateOptions = projectData.template;
      }

      customizedOptions = {};
      if (projectData.options) {
        customizedOptions = projectData.options;
      }

      // highed.merge(customizedOptions, {
      //   data: {
      //     csv: undefined
      //   }
      // });

      // if (customizedOptions && customizedOptions.data) {
      //   customizedOptions.data.csv = undefined;
      // }

      if (customizedOptions.lang) {
        Highcharts.setOptions({
          lang: customizedOptions.lang
        });
      }

      if (typeof projectData.theme !== 'undefined') {
        assignTheme(projectData.theme, true);
      }

      if (customizedOptions && customizedOptions.series) {
        customizedOptions.series = highed.isArr(customizedOptions.series)
          ? customizedOptions.series
          : [customizedOptions.series];

        customizedOptions.series.forEach(function(series) {
          if (typeof series._colorIndex !== 'undefined') {
            delete series._colorIndex;
          }
        });
      }

      setCustomCode(
        projectData.customCode,
        function(err) {
          highed.snackBar('Error in custom code: ' + err);
        },
        true
      );

      constr = 'Chart';

      // Support legacy format
      if (projectData.settings && projectData.settings.templateView) {
        if (projectData.settings.templateView.activeSection === 'stock') {
          constr = 'StockChart';
        }
      }

      if (
        projectData.settings &&
        highed.isStr(projectData.settings.constructor)
      ) {
        constr = projectData.settings.constructor;
      }

      if (projectData.settings && projectData.settings.dataProvider) {
        if (projectData.settings.dataProvider.seriesMapping) {
          highed.merge(customizedOptions, {
            data: {
              seriesMapping: projectData.settings.dataProvider.seriesMapping
            }
          });
        }

        if (projectData.settings.dataProvider.googleSpreadsheet) {
          var provider = projectData.settings.dataProvider;
          var sheet = provider.googleSpreadsheet;

          if (customizedOptions.data) {
            sheet.startRow =
              provider.startRow || customizedOptions.data.startRow;
            sheet.endRow = provider.endRow || customizedOptions.data.endRow;
            sheet.startColumn =
              provider.startColumn || customizedOptions.data.startColumn;
            sheet.endColumn =
              provider.endColumn || customizedOptions.data.endColumn;
          }

          events.emit(
            'ProviderGSheet',
            projectData.settings.dataProvider.googleSpreadsheet
          );

          loadGSpreadsheet(sheet);

          hasData = true;
        } else if (projectData.settings.dataProvider.csv) {
          // We need to fix potential html-entities as they will mess up separators
          Object.keys(htmlEntities).forEach(function(ent) {
            projectData.settings.dataProvider.csv = projectData.settings.dataProvider.csv.replace(
              new RegExp(ent, 'g'),
              htmlEntities[ent]
            );
          });

          loadCSVData({
            csv: projectData.settings.dataProvider.csv
          });

          events.emit('LoadProjectData', projectData.settings.dataProvider.csv);

          hasData = true;
        }
      }

      // Not sure if this should be part of the project files yet
      // if (projectData.editorOptions) {
      //     Object.keys(projectData.editorOptions, function (key) {
      //         highed.option(key, projectData.editorOptions[key]);
      //     });
      // }

      if (!hasData) {
        updateAggregated();
        init(aggregatedOptions);
        emitChange();
      }

      events.emit('LoadProject', projectData);
    }
  }

  function loadGSpreadsheet(options) {
    lastLoadedCSV = false;
    lastLoadedSheet = options;

    lastLoadedSheet.googleSpreadsheetKey =
      lastLoadedSheet.googleSpreadsheetKey || lastLoadedSheet.id;
    lastLoadedSheet.googleSpreadsheetWorksheet =
      lastLoadedSheet.googleSpreadsheetWorksheet || lastLoadedSheet.worksheet;

    highed.merge(customizedOptions, {
      data: lastLoadedSheet
    });

    updateAggregated();
    init(aggregatedOptions);
    loadSeries();
    emitChange();

    // The sheet will be loaded async, so we should listen to the load event.
    gc(function(chart) {
      var found = Highcharts.addEvent(chart, 'load', function() {
        loadSeries();
        found();
      });
    });
  }

  function getCleanOptions(source) {
    return source;

    // return highed.merge(highed.merge({}, source), {
    //   data: {
    //     csv: false
    //   }
    // });

    // var clone = highed.merge({}, source || customizedOptions);

    // if (!highed.isArr(clone.yAxis)) {
    //   clone.yAxis = [clone.yAxis];
    // }

    // (clone.yAxis || []).forEach(function (axis) {
    //   if (axis.series) {
    //     delete axis.series.data;
    //   }
    // });

    // return clone;
  }

  /** Export project as JSON
   *  @memberof highed.ChartPreview
   */
  function toProject() {
    var loadedCSVRaw = false,
      gsheet = lastLoadedSheet,
      themeData = false;

    if (
      chart &&
      chart.options &&
      chart.options.data &&
      chart.options.data.csv
    ) {
      loadedCSVRaw = chart.options.data.csv;
    }

    if (
      chart &&
      chart.options &&
      chart.options.data &&
      chart.options.data.googleSpreadsheetKey
    ) {
      gsheet = {
        googleSpreadsheetKey: chart.options.data.googleSpreadsheetKey,
        googleSpreadsheetWorksheet:
          chart.options.data.googleSpreadsheetWorksheet
      };
    }

    if (themeMeta && themeMeta.id && themeOptions) {
      themeData = {
        id: themeMeta.id,
        name: themeMeta.name,
        options: themeOptions || {}
      };
    }

    return {
      template: templateOptions,
      options: getCleanOptions(customizedOptions),
      customCode: highed.isFn(customCode) ? customCodeStr : '',
      theme: themeData,
      settings: {
        constructor: constr,
        dataProvider: {
          csv: !gsheet ? loadedCSVRaw || lastLoadedCSV : false,
          googleSpreadsheet: gsheet
        }
      }
      //editorOptions: highed.serializeEditorOptions()
    };
  }

  function clearData(skipReinit) {
    lastLoadedCSV = false;
    lastLoadedSheet = false;

    if (customizedOptions && customizedOptions.data) {
      customizedOptions.data = {};
    }

    if (customizedOptions.series) {
      customizedOptions.series = highed.isArr(customizedOptions.series)
        ? customizedOptions.series
        : [customizedOptions.series];

      customizedOptions.series.forEach(function(series) {
        if (series.data) {
          delete series.data;
        }
      });
    }

    if (!skipReinit) {
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    }
  }

  /**
   * Export project as a JSON string
   */
  function toProjectStr(tabs) {
    return stringifyFn(toProject(), tabs);
  }

  /** Load JSON data
   * Functionally, this only instances a new
   * chart with the supplied data as its options.
   * It accepts both a string and and object
   *
   * @memberof highed.ChartPreview
   * @name data.json
   * @param data {object} - the data to load
   */
  function loadJSONData(data) {
    lastLoadedCSV = false;

    gc(function(chart) {
      if (highed.isStr(data)) {
        try {
          loadJSONData(JSON.parse(data));
        } catch (e) {
          highed.snackBar('invalid json: ' + e);
        }
      } else if (highed.isBasic(data)) {
        highed.snackBar('the data is not valid json');
      } else {
        templateOptions = {};
        highed.clearObj(customizedOptions);
        highed.merge(customizedOptions, highed.merge({}, data));

        if (!highed.isNull(data.series)) {
          customizedOptions.series = data.series;
        }

        updateAggregated();
        init(customizedOptions);
        loadSeries();
        emitChange();
      }
    });
  }

  /**
   * Load raw dataset (array of arrays)
   */
  //function

  /** Set chart options from an object
   *
   */
  function setChartOptions(options) {
    function emitWidthChange() {
      events.emit('AttrChange', {
        id: 'chart.width'
      });
    }

    function emitHeightChange() {
      events.emit('AttrChange', {
        id: 'chart.height'
      });
    }

    var doEmitHeightChange = false,
      doEmitWidthChange = false;

    // Temp. hack to deal with actual sizing
    if (options && options.chart) {
      if (typeof options.chart.width !== 'undefined') {
        if (
          !customizedOptions.chart ||
          typeof customizedOptions.chart === 'undefined'
        ) {
          doEmitWidthChange = true;
        } else if (customizedOptions.chart.width !== options.chart.width) {
          doEmitWidthChange = true;
        }
      }

      if (typeof options.chart.height !== 'undefined') {
        if (
          !customizedOptions.chart ||
          typeof customizedOptions.chart === 'undefined'
        ) {
          doEmitHeightChange = true;
        } else if (customizedOptions.chart.height !== options.chart.height) {
          doEmitHeightChange = true;
        }
      }
    }

    // console.time('remblanks');
    customizedOptions = highed.transform.remBlanks(
      highed.merge({}, options, false)
    );
    // console.timeEnd('remblanks');

    if (customizedOptions && customizedOptions.lang) {
      Highcharts.setOptions({
        lang: customizedOptions.lang
      });
    }

    if (options && options.global) {
    }

    // This is nasty
    if (options && options.data && options.data.googleSpreadsheetKey) {
      events.emit('LoadedGoogleSpreadsheet');
    }

    updateAggregated();
    init(aggregatedOptions, false, true);
    emitChange();

    if (doEmitHeightChange) {
      emitHeightChange();
    }

    if (doEmitWidthChange) {
      emitWidthChange();
    }
  }

  /** Load chart settings
   * Note that merges the incoming settings with the existing ones.
   * @memberof highed.ChartPreview
   * @name data.settings
   * @param settings {object} - the settings to load
   */
  function loadChartSettings(settings) {
    gc(function(chart) {
      Object.keys(settings || {}).forEach(function(key) {
        highed.setAttr(customizedOptions, key, settings[key]);
      });

      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    });
  }

  function loadSeriesData(seriesArr) {
    if (!highed.isArr(seriesArr)) return;
    customizedOptions.series = customizedOptions.series || [];

    if (seriesArr.length < customizedOptions.series.length) {
      //Need to delete some series
      customizedOptions.series.splice(
        seriesArr.length,
        customizedOptions.series.length - seriesArr.length
      );
    }

    seriesArr.forEach(function(s, i) {
      if (s.name) {
        set('series-name', s.name, i);
      }
      if (s.data) {
        set('series-data', s.data, i);
      }
    });
  }

  /** Set an attribute
   *  @memberof highed.ChartPreview
   *  @name options.set
   *  @param id {string} - the path of the attribute
   *  @param value {anything} - the value to set
   *  @param index {number} - used if the option is an array
   */
  function set(id, value, index) {
    gc(function(chart) {
      //highed.setAttr(chart.options, id, value, index);
      highed.setAttr(
        chart.options,
        'plotOptions--series--animation',
        false,
        index
      );
    });

    //We want to be able to set the customized options even if the chart
    //doesn't exist
    highed.setAttr(customizedOptions, id, value, index);

    flatOptions[id] = value;

    if (id.indexOf('lang--') === 0 && customizedOptions.lang) {
      Highcharts.setOptions({
        lang: customizedOptions.lang
      });
    }

    updateAggregated();
    init(aggregatedOptions, false, true);
    emitChange();

    events.emit('AttrChange', {
      id: id.replace(/\-\-/g, '.').replace(/\-/g, '.'),
      value: value
    });
  }

  /** Get embeddable JSON
   *  This returns the merged chart, with both customized options
   *  and options set indirectly through templates.
   *  @memberof highed.ChartPreview
   *  @name export.json
   *  @returns {object} - the chart object
   */
  function getEmbeddableJSON(noCustomCode) {
    var r;

    updateAggregated(noCustomCode);
    r = getCleanOptions(highed.merge({}, aggregatedOptions));

    //This should be part of the series
    if (!highed.isNull(r.data)) {
      // Don't delete spreadsheet stuff
      if (!r.data.googleSpreadsheetKey) {
        r.data = undefined;
      }
      //delete r['data'];
    }

    if (r && highed.isArr(r.series)) {
      r.series = r.series.map(function(s) {
        var cloned = highed.merge({}, s);
        delete s.data;
        return s;
      });
    }

    if (lastLoadedSheet) {
      highed.merge(r, {
        data: lastLoadedSheet
      });
    } else if (lastLoadedCSV) {
      highed.merge(r, {
        data: {
          csv: lastLoadedCSV,
          googleSpreadsheetKey: false,
          googleSpreadsheetWorksheet: false
        }
      });
    }

    return r;
  }

  /**
   * Convert the chart to a string
   */
  function toString(tabs) {
    return stringifyFn(getEmbeddableJSON(), tabs);
  }

  /** Get embeddable SVG
   *  @memberof highed.ChartPreview
   *  @name export.svg
   *  @returns {string} - the result from `Highcharts.Chart.getSVG()`
   */
  function getEmbeddableSVG() {
    return gc(function(chart) {
      return highed.isFn(chart.getSVG) ? chart.getSVG() : '';
    });
  }

  /** Get embeddable JavaScript
   *  @memberof highed.ChartPreview
   *  @name export.js
   *  @param id {string} - the ID of the node to attach the chart to
   *  @returns {string} - a string containing JavaScript to reproduce the chart
   */
  function getEmbeddableJavaScript(id) {
    return gc(function(chart) {
      var cdnIncludes = [
          'https://code.highcharts.com/stock/highstock.js',
          'https://code.highcharts.com/highcharts-more.js',
          'https://code.highcharts.com/highcharts-3d.js',
          'https://code.highcharts.com/modules/data.js',
          'https://code.highcharts.com/modules/exporting.js',
          'http://code.highcharts.com/modules/funnel.js',
          'http://code.highcharts.com/modules/solid-gauge.js'
        ],
        cdnIncludesArr = [],
        title =
          chart.options && chart.options.title
            ? chart.options.title.text || 'untitled chart'
            : 'untitled chart';

      id = id || '';

      /*
                This magic code will generate an injection script that will
                check if highcharts is included, and include it if not.
                Afterwards, it will create the chart, and insert it into the page.

                It's quite messy, could to client-side templating or something,
                but it works.
            */

      if (highed.option('includeCDNInExport')) {
        cdnIncludesArr = [
          'var files = ',
          JSON.stringify(cdnIncludes),
          ',',
          'loaded = 0; ',
          'if (typeof window["HighchartsEditor"] === "undefined") {',
          'window.HighchartsEditor = {',
          'ondone: [cl],',
          'hasWrapped: false,',
          'hasLoaded: false',
          '};',
          'include(files[0]);',
          '} else {',
          'if (window.HighchartsEditor.hasLoaded) {',
          'cl();',
          '} else {',
          'window.HighchartsEditor.ondone.push(cl);',
          '}',
          '}',
          'function isScriptAlreadyIncluded(src){',
          'var scripts = document.getElementsByTagName("script");',
          'for (var i = 0; i < scripts.length; i++) {',
          'if (scripts[i].hasAttribute("src")) {',
          'if ((scripts[i].getAttribute("src") || "").indexOf(src) >= 0 || (scripts[i].getAttribute("src") === "http://code.highcharts.com/highcharts.js" && src === "https://code.highcharts.com/stock/highstock.js")) {',
          'return true;',
          '}',
          '}',
          '}',
          'return false;',
          '}',
          'function check() {',
          'if (loaded === files.length) {',
          'for (var i = 0; i < window.HighchartsEditor.ondone.length; i++) {',
          'try {',
          'window.HighchartsEditor.ondone[i]();',
          '} catch(e) {',
          'console.error(e);',
          '}',
          '}',
          'window.HighchartsEditor.hasLoaded = true;',
          '}',
          '}',

          'function include(script) {',
          'function next() {',
          '++loaded;',
          'if (loaded < files.length) {',
          'include(files[loaded]);',
          '}',
          'check();',
          '}',
          'if (isScriptAlreadyIncluded(script)) {',
          'return next();',
          '}',
          'var sc=document.createElement("script");',
          'sc.src = script;',
          'sc.type="text/javascript";',
          'sc.onload=function() { next(); };',
          'document.head.appendChild(sc);',
          '}',

          'function each(a, fn){',
          'if (typeof a.forEach !== "undefined"){a.forEach(fn);}',
          'else{',
          'for (var i = 0; i < a.length; i++){',
          'if (fn) {fn(a[i]);}',
          '}',
          '}',
          '}',

          'var inc = {},incl=[]; each(document.querySelectorAll("script"), function(t) {inc[t.src.substr(0, t.src.indexOf("?"))] = 1; ',
          '});'
        ];
      }

      return (
        '\n' +
        [
          '(function(){ ',

          cdnIncludesArr.join(''),

          ' function cl() {',
          'if(typeof window["Highcharts"] !== "undefined"){', //' && Highcharts.Data ? ',

          !customizedOptions.lang
            ? ''
            : 'Highcharts.setOptions({lang:' +
              JSON.stringify(customizedOptions.lang) +
              '});',
          'var options=',
          stringifyFn(getEmbeddableJSON(true)),
          ';',
          highed.isFn(customCode) ? customCodeStr : '',
          'new Highcharts.' + constr + '("',
          id,
          '", options);',
          '}',
          '}',
          '})();'
        ].join('') +
        '\n'
      );
    });
  }

  function getCodePreview() {
    var options = getEmbeddableJSON(true);

    if (highed.isFn(customCode) && customCodeStr) {
      customCode(options);
    }

    return stringifyFn(options, '  ');
  }

  /** Get embeddable HTML
   *  @memberof highed.ChartPreview
   *  @name export.html
   *  @param placehold {bool} - if true, SVG will also be embedded
   *  @returns {string} - a string of embeddable HTML
   */
  function getEmbeddableHTML(placehold) {
    return gc(function(chart) {
      var id = 'highcharts-' + highed.uuid();
      return (
        '\n' +
        [
          '<div id="',
          id,
          '">',
          placehold ? getEmbeddableSVG() : '',
          '</div>'
        ].join('') +
        '<script>' +
        getEmbeddableJavaScript(id) +
        '</script>'
      );
    });
  }

  /**
   * Expand the chart from its drawer
   * @memberof highed.ChartPreview
   */
  function expand() {
    gc(function(chart) {
      if (!expanded) {
        highed.dom.style(properties.expandTo, {
          width: '100%',
          display: 'block'
        });

        preExpandSize = highed.dom.size(parent);
        init(chart.options, properties.expandTo);
        expanded = true;

        toggleButton.className =
          'highed-icon highed-chart-preview-expand fa fa-times-circle';
      }
    });
  }

  /** Collapse the chart into its drawer
   *  @memberof highed.ChartPreview
   */
  function collapse() {
    gc(function(chart) {
      if (preExpandSize && expanded) {
        highed.dom.style(properties.expandTo, {
          width: '0px',
          display: 'none'
        });

        toggleButton.className =
          'highed-icon highed-chart-preview-expand fa fa-external-link-square';

        init(chart.options, parent);
        expanded = false;
      }
    });
  }

  /** Flush all options and start over
   *  @memberof highed.ChartPreview
   *  @name new
   */
  function newChart() {
    highed.cloud.flush();

    highed.clearObj(templateOptions);
    highed.clearObj(customizedOptions);
    highed.clearObj(flatOptions);

    customCode = false;

    highed.merge(customizedOptions, properties.defaultChartOptions);

    updateAggregated();

    init(aggregatedOptions);

    emitChange();
    events.emit('New');
  }

  /** Export the chart - calls `Highcharts.Chart.exportChart(..)`
   *  @memberof highed.ChartPreview
   *  @name data.export
   *  @param optons {object} - the export options
   */
  function exportChart(options) {
    gc(function(chart) {
      chart.exportChart(options, aggregatedOptions);
    });
  }

  /** Attach to a new DOM parent
   *  @memberof highed.ChartPreview
   *  @param newParent {DOMNode} - the node to attach to
   */
  function changeParent(newParent) {
    parent = newParent;
    init();
  }

  /** Returns the constructor currently in use
   *  @memberof highed.ChartPreview
   *  @returns {string}
   */
  function getConstructor() {
    return constr;
  }

  function getTheme() {
    return {
      id: themeMeta.id,
      name: themeMeta.name,
      options: themeOptions
    };
  }

  function getCustomCode() {
    return customCodeStr && customCodeStr.length
      ? customCodeStr
      : customCodeDefault;

    // return highed.isFn(customCode) ?
    // customCodeStr || customCodeDefault :
    // customCode || customCodeDefault;
  }

  function setCustomCode(newCode, errFn, skipEmit) {
    var fn;

    if (!newCode) {
      customCode = false;
      customCodeStr = '';
    }

    try {
      // eval('(var options = {};' + newCode + ')');
      customCode = new Function(
        'options',
        [
          'if (options.yAxis && options.yAxis.length === 1) options.yAxis = options.yAxis[0];',
          'if (options.xAxis && options.xAxis.length === 1) options.xAxis = options.xAxis[0];',
          'if (options.zAxis && options.zAxis.length === 1) options.zAxis = options.zAxis[0];'
        ].join('') + newCode
      );
      customCodeStr = newCode;
    } catch (e) {
      customCode = false;
      customCodeStr = newCode;
      return highed.isFn(errFn) && errFn(e);
    }

    if (!skipEmit) {
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    }
  }

  ///////////////////////////////////////////////////////////////////////////

  //Init the initial chart
  updateAggregated();
  init();

  highed.dom.on(toggleButton, 'click', function() {
    return expanded ? collapse() : expand();
  });

  ///////////////////////////////////////////////////////////////////////////

  exports = {
    assignTheme: assignTheme,
    getTheme: getTheme,
    getConstructor: getConstructor,
    on: events.on,
    expand: expand,
    collapse: collapse,
    new: newChart,
    changeParent: changeParent,

    getHighchartsInstance: gc,

    loadTemplate: loadTemplate,
    loadSeries: loadSeriesData,
    resize: resize,

    setCustomCode: setCustomCode,
    getCustomCode: getCustomCode,

    toProject: toProject,
    toProjectStr: toProjectStr,
    loadProject: loadProject,

    toString: toString,

    options: {
      set: set,
      setAll: setChartOptions,
      customized: customizedOptions,
      getCustomized: function() {
        return customizedOptions;
      },
      full: aggregatedOptions,
      flat: flatOptions,
      chart: chartOptions,
      getPreview: getCodePreview
    },

    data: {
      csv: loadCSVData,
      json: loadJSONData,
      settings: loadChartSettings,
      export: exportChart,
      gsheet: loadGSpreadsheet,
      clear: clearData
    },

    export: {
      html: getEmbeddableHTML,
      json: getEmbeddableJSON,
      svg: getEmbeddableSVG,
      js: getEmbeddableJavaScript
    }
  };

  return exports;
};
