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
highed.ChartPreview = function(parent, attributes, planCode) {
  var properties = highed.merge(
      {
        defaultChartOptions: {
          title: {
            text: 'Chart Title'
          },
          subtitle: {
            text: ''
          },
          plotOptions: {
            series: {
              allowPointSelect: true, //Maps
              states: {
                hover: {
                    color: '#a4edba'
                },
                select: {
                    color: '#EFFFEF',
                    borderColor: 'black',
                    dashStyle: 'dot'
                }
              }
            }
          },
          exporting: {
            //   url: 'http://127.0.0.1:7801'
          },
          credits: {
            text: 'cloud.highcharts.com',
            href: 'https://cloud.highcharts.com'
          },
          data: {}
        },
        expandTo: parent
      },
      attributes
    ),
    events = highed.events(),
    customizedOptions = {},
    aggregatedOptions = {},
    flatOptions = {},
    templateOptions = [],
    chartOptions = {},
    themeOptions = {},
    annotations = [],
    themeCustomCode = '',
    themeMeta = {},
    exports = {},
    prevConstr = 'Chart',
    chartPlugins = {},
    customCodeDefault = highed.meta.customCodeDefault.join('\n'),
    customCode = '',
    customCodeStr = '',
    lastLoadedCSV = false,
    lastLoadedSheet = false,
    lastLoadedLiveData = false,
    throttleTimeout = false,
    chart = false,
    preExpandSize = false,
    dataTableCSV = null,
    assignDataFields = null,
    templateSettings = {},
    toggleButton = highed.dom.cr(
      'div',
      'highed-icon highed-chart-preview-expand fa fa-external-link-square'
    ),
    expanded = false,
    constr = ['Chart'],
    wysiwyg = {
      'g.highcharts-legend': { tab: 'Legend', dropdown: 'General', id: 'legend--enabled' },
      'text.highcharts-title': { tab: 'Chart',  dropdown: 'Title', id: 'title--text' },
      'text.highcharts-subtitle': { tab: 'Chart', dropdown: 'Title',id: 'subtitle--text' },
      '.highcharts-yaxis-labels': { tab: 'Axes', dropdown: 'Y Axis', id: 'yAxis-labels--format' },
      '.highcharts-xaxis-labels': { tab: 'Axes', dropdown: 'X Axis', id: 'xAxis-labels--format' },
      '.highcharts-xaxis .highcharts-axis-title': {
        tab: 'Axes', 
        dropdown: 'X Axis',
        id: 'xAxis-title--text'
      },
      '.highcharts-yaxis .highcharts-axis-title': {
        tab: 'Axes',
        dropdown: 'Y Axis',
        id: 'yAxis-title--text'
      },
      'rect.highcharts-background': {
        tab: 'Chart',
        dropdown: 'Appearance',
        id: 'chart--backgroundColor'
      },
      '.highcharts-series': { tab: 'Data series', id: 'series' },
      'g.highcharts-tooltip': { tab: 'Chart', dropdown: 'Tooltip', id: 'tooltip--enabled' }
    },
    /*
    wysiwyg2 = {
      'text.highcharts-title': { id: 'title--text', source: 'text.highcharts-title tspan'},
    },
    inputField = highed.dom.cr('input', 'highed-chart-input-field'),*/
    stockToolsContainer,
    isAnnotating = true,
    mapData, 
    stockTools = highed.StockTools(planCode);

    if (planCode && planCode === 1) {
      stockTools.hide();
    }

    if (highed.chartType === 'Map') {
      highed.merge(properties, 
        {
          mapNavigation: {
            enabled: true,
            enableDoubleClickZoomTo: true
          }
        }
      );
    }


  stockTools.on('ShowAnnotationModal', function(options) {
      events.emit('ShowAnnotationModal', options);
    });

    stockTools.on('Payup', function(){
      events.emit('Payup');
    });

    stockTools.on('ForceChartRefresh', function(){
      init();
    });

    stockTools.on('StockToolsChanged', function(option, index, type) {
      if (chart.annotations[index] && chart.annotations[index].userOptions) {
        if (chart.annotations[index].userOptions.langKey === 'label') {
          chart.annotations[index].userOptions.labels[0].point = (type === 'AnnotationHandleMoved' ? option : option.labels[0].point);
        }
      }
    });


/*
    highed.dom.ap(document.body, inputField);

    inputField.addEventListener('keydown', function (e) {
    });
*/

    document.addEventListener('keydown', function (e) {

      if(e.keyCode === 8 || e.keyCode === 46){
        if (chart.currentAnnotation && !stockTools.getAnnotationModalOpen()) {
          var navigation = chart.navigationBindings;
          navigation.activeAnnotation = false;
          navigation.chart.removeAnnotation(chart.currentAnnotation);
          chart.currentAnnotation = null;
          var popupCloseBtn = document.querySelector('.highcharts-popup-close');
          if (popupCloseBtn) {
            popupCloseBtn.click();
          }
        }
      }
    }, false);

    ///////////////////////////////////////////////////////////////////////////

  function closeAnnotationPopup() {
    stockTools.closeAnnotationPopup()
  }

  function toggleShowAnnotationIcon(toggle){
    stockTools.toggleAnnotationIcon(toggle);
  }

  function updateMapCodes(data) {
    mapData = data;
  }

  function attachMapClickHandler() {
    (mapData || []).forEach(function(d) {
      if (d.id) {
        highed.dom.on(document.querySelector('.highcharts-key-' + (d.id).toString().toLowerCase().replace(/\./g, "-")), 'dblclick', function(e) {
          events.emit('EditMap', d);
        });
      }
    });
  }

  function attachWYSIWYG() {

    Object.keys(wysiwyg).forEach(function(key) {
      highed.dom.on(parent.querySelector(key), 'click', function(e) {
        
        var navigation = chart.navigationBindings;
        if (navigation.selectedButtonElement) return;

        events.emit('RequestEdit', wysiwyg[key], e.clientX, e.clientY);
        e.cancelBubble = true;
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      });
    });

/*
    Object.keys(wysiwyg2).forEach(function(key) {

      highed.dom.on(parent.querySelector(key), 'click', function(e) {

        var element = document.querySelector(key);
        var source = document.querySelector(wysiwyg2[key].source),
            pos = highed.dom.pos(element, true);

        highed.dom.style(inputField, {
          position: 'absolute',
          top: pos.y + 'px',
          left: pos.x + 'px'
        });

        console.log(source);
        inputField.value = source.innerHTML;

        inputField.focus();
      });

    })

*/

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


  /* Refresh the chart */
  function isTileMap(options){
    return options.series && (options.series || []).some(function(s){return s.type === 'tilemap';});
  }

  /* Init the chart */
  function init(options, pnode, noAnimation) {
    var i;

    //We want to work on a copy..
    options = options || aggregatedOptions;

    if (highed.isArr(constr)) constr = constr;
    else constr = ['Chart'];

    stockTools.init(Highcharts);

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

    // (pnode || parent).innerHTML = 'Chart not loaded yet';

    // options.chart = options.chart || {};
    // options.chart.width = '100%';
    // options.chart.height = '100%';

    // if (options && options.chart) {
    //   delete options.chart.width;
    //   delete options.chart.height;
    // }

    try {
      const chartConstr = (highed.chartType === 'Map' ? isTileMap(options) ? 'Chart' : 'Map' : (constr.some(function(a) {
        return a === 'StockChart';
      }) ? 'StockChart' : 'Chart'));

      options = highed.merge(options, stockTools.getStockToolsToolbarConfig());

      chart = new Highcharts[chartConstr](pnode || parent, options);

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
      attachMapClickHandler();

      if (chart && chart.reflow) {
        //chart.reflow();
      }
      
      Highcharts.error = function (code, stopLoading) {
        if (stopLoading) throw code;
        else {      
          setTimeout(function() {
            events.emit('Error', {
              code: code,
              url : (code ? 'https://www.highcharts.com/errors/' + code : ''),
              warning: true
            });  
          }, 200);
        }
      };
      
      Highcharts.addEvent(chart, 'afterPrint', function() {
        events.emit('RequestResize');
        // highed.dom.ap(pnode || parent, toggleButton);
      });

      events.emit('ChartRecreated');
    } catch (code) {
      events.emit('Error', {
        code: code,
        url : (code ? 'https://www.highcharts.com/errors/' + code : '')
      });

      highed.emit('UIAction', 'UnsuccessfulChartGeneration');

      (pnode || parent).innerHTML = '';  
      
      chart = false;
    }
    return chart;
  }

  /** Resize the preview
   *  Resizes based on the parent size.
   *  @memberof highed.ChartPreview
   */
  function resize(width, height) {

      if (chart && chart.reflow) {
        // && chart.options) {
        try {
          if (width && height) {
            chart.setSize(width, height, true);
            chart.options.chart.width = null;
            chart.options.chart.height = null;
          } else {
            chart.setSize(undefined, undefined, false);
            chart.reflow();
          }
        } catch (e) {
          // No idea why this keeps failing
        }
      }
  }

  /**
   * Clear all themes from the chart.
   * Used by cloud to reset theme
   */
  function clearTheme(theme, skipEmit) {
    themeOptions = false;

    if (!skipEmit) {
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
      events.emit('SetResizeData');
    }

    return true;
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
        name: theme.name || theme.id,
        plugins: theme.plugins
      };

      if (theme.plugins && theme.plugins.cssModules && theme.plugins.cssModules.length > 0) {
        highed.loadModules(theme.plugins.cssModules);
      }

      if (highed.chartType === 'Map') {
        if (theme.options.series && highed.isArr(theme.options.series)) {
          theme.options.series.forEach(function(serie) {
            serie.data = [];
          });
        }
        if (theme.options.chart && theme.options.chart.map) {
          delete theme.options.chart.map;
        }
      }

      themeOptions = highed.merge({}, theme.options);
      themeCustomCode = theme.customCode || '';
    } else {
      themeMeta = {
        id: highed.uuid(),
        name: 'Untitled Theme'
      };

      if (highed.chartType === 'Map') {
        if (theme.series && highed.isArr(theme.series)) {
          theme.series.forEach(function(serie) {
            serie.data = [];
          });
        }
      }

      themeOptions = highed.merge({}, theme);

    }

    if (!skipEmit) {
      events.emit('UpdateCustomCode');
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
      events.emit('SetResizeData');
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


   // templateOptions = templateOptions || {};
    templateOptions = templateOptions || [];
    var aggregatedTemplate = {}; 


    //Merge fest

    highed.clearObj(aggregatedOptions);

    highed.merge(aggregatedOptions, properties.defaultChartOptions);
    // Apply theme first
    if (themeOptions && Object.keys(themeOptions).length) {
      highed.merge(
        aggregatedOptions,
        highed.merge(highed.merge({}, themeOptions))
      );
    }

    templateOptions.forEach(function(arr) {

      if (arr) {
        
        if (arr.yAxis && !highed.isArr(arr.yAxis)) {
          arr.yAxis = [arr.yAxis];
        }
  
        if (arr.xAxis && !highed.isArr(arr.xAxis)) {
          arr.xAxis = [arr.xAxis];
        }
  
        aggregatedTemplate = highed.merge(aggregatedTemplate, arr);
      }
    });

    highed.merge(
      aggregatedOptions,
      highed.merge(highed.merge({}, aggregatedTemplate), customizedOptions)
    );
    aggregatedOptions = highed.merge(aggregatedOptions, stockTools.getStockToolsToolbarConfig());
    //aggregatedOptions.stockTools = stockToolsToolbarConfig;

    if (!aggregatedOptions.yAxis && customizedOptions.yAxis) {
      aggregatedOptions.yAxis = customizedOptions.yAxis
    }

    if (!aggregatedOptions.xAxis && customizedOptions.xAxis) {
      aggregatedOptions.xAxis = customizedOptions.xAxis
    }

    //This needs to be cleaned up
    if (aggregatedOptions.yAxis && aggregatedTemplate.yAxis) {
      aggregatedOptions.yAxis.forEach(function(obj, i) {
        if (i < aggregatedTemplate.yAxis.length) {
          highed.merge(obj, aggregatedTemplate.yAxis[i]);
        }
      });
    }

    if (aggregatedOptions.xAxis && aggregatedTemplate.xAxis && highed.isArr(aggregatedOptions.xAxis)) {
      (aggregatedOptions.xAxis).forEach(function(obj, i) {
        if (i < aggregatedTemplate.xAxis.length) {
          highed.merge(obj, aggregatedTemplate.xAxis[i]);
        }
      });
    }
    if (themeOptions && themeOptions.xAxis) {
      themeOptions.xAxis = highed.isArr(themeOptions.xAxis)
        ? themeOptions.xAxis
        : [themeOptions.xAxis];

      if (highed.isArr(aggregatedOptions.xAxis)) {
        (aggregatedOptions.xAxis).forEach(function(obj, i) {
          if (i < themeOptions.xAxis.length) {
            highed.merge(obj, themeOptions.xAxis[i]);
          }
        });
      }
    }

    if (themeOptions && themeOptions.yAxis) {
      themeOptions.yAxis = highed.isArr(themeOptions.yAxis)
        ? themeOptions.yAxis
        : [themeOptions.yAxis];

      if (highed.isArr(aggregatedOptions.yAxis)) {
        aggregatedOptions.yAxis.forEach(function(obj, i) {
          if (i < themeOptions.yAxis.length) {
            highed.merge(obj, themeOptions.yAxis[i]);
          }
        });
      }
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

    /*
    if (aggregatedTemplate.series) {
      aggregatedOptions.series = aggregatedOptions.series || [];
      
      aggregatedTemplate.series.forEach(function(obj, i) {
        if (i < aggregatedOptions.series.length) {
          highed.merge(aggregatedOptions.series[i], obj);
        } else {
          aggregatedOptions.series.push(highed.merge({}, obj));
        }
      });
    }*/
    
    highed.merge(
      aggregatedOptions,
      highed.merge({}, customizedOptions)
    );


    if (themeOptions && themeOptions.series) {
      if (aggregatedOptions.series) {
        aggregatedOptions.series.forEach(function (serie, i) {
          if (!serie.type && themeOptions.series[i] && themeOptions.series[i].type) {
            serie.type = themeOptions.series[i].type
          }
        });
      }
    }

    if (themeOptions && themeOptions.colorAxis) {
      aggregatedOptions.colorAxis = themeOptions.colorAxis;
    }

    if (aggregatedOptions.yAxis && !highed.isArr(aggregatedOptions.yAxis)) {
      aggregatedOptions.yAxis = [aggregatedOptions.yAxis];
    }

    if (aggregatedOptions.xAxis && !highed.isArr(aggregatedOptions.xAxis)) {
      aggregatedOptions.xAxis = [aggregatedOptions.xAxis];
    }


    if (aggregatedOptions.data && Object.keys(aggregatedOptions.data).length > 0 && aggregatedOptions.data.csv){ //&& chart && chart.annotations && chart.annotations.length !== 0) {
      if (chart) {
        annotations = [];

        chart.annotations.forEach(function(annotation, index) {
          annotations.push(annotation.userOptions);
        });
      }
  
      aggregatedOptions.annotations = annotations.slice();
    }

    highed.merge(aggregatedOptions, highed.option('stickyChartProperties'));

    if (highed.isArr(aggregatedOptions.yAxis) && aggregatedOptions.yAxis.length === 1) {
      aggregatedOptions.yAxis = aggregatedOptions.yAxis[0]
    }
    if (highed.isArr(aggregatedOptions.xAxis) && aggregatedOptions.xAxis.length === 1) {
      aggregatedOptions.xAxis = aggregatedOptions.xAxis[0]
    }

    // Finally, do custom code
    if (!noCustomCode && highed.isFn(customCode)) {
      try{
        customCode(aggregatedOptions);
      } catch(e) {
        console.log("Error in Custom Code:", e);
      }
    }
  }

  function deleteSeries(length) {
    if (customizedOptions && customizedOptions.series) {
      customizedOptions.series = customizedOptions.series.slice(0, length);
      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    }
  }

  function deleteSerie(index) {
    
    if (customizedOptions.series && customizedOptions.series[index]) {
      customizedOptions.series.splice(index, 1);
      delete templateSettings[index];
    }

    updateAggregated();
    init(aggregatedOptions);
  }

  function loadTemplateForSerie(template, seriesIndex, skipEmit) {
    var type = template.config.chart.type;
    delete template.config.chart.type;

    constr[seriesIndex] = template.constructor || 'Chart';

    if (template.config.series && template.config.series[0]) {
      type = template.config.series[0].type
    }

    seriesIndex.forEach(function(index) {
      if (!templateSettings[index]) templateSettings[index] = {};

      templateSettings[index].templateTitle = template.title;
      templateSettings[index].templateHeader = template.header;
      
      if (customizedOptions.series && customizedOptions.series[index]) {
        if (template.config.series && template.config.series[0]) {
          highed.merge(customizedOptions.series[index], template.config.series[0]);
        } else {
          customizedOptions.series[index].type = type; //template.config.chart.type;
        }
      } else {
        if (!customizedOptions.series) {
          customizedOptions.series = [];
        }
        customizedOptions.series[index] = {
          type: type, //template.config.chart.type,
          turboThreshold: 0,
          _colorIndex: (customizedOptions.series || []).length,
          _symbolIndex: 0,
          compare: undefined
        };
      }
    
    });
    
    //templateOptions = highed.merge({}, template.config || {});
    templateOptions[seriesIndex] = highed.merge({}, template.config || {});
    
    if (!skipEmit) {
      updateAggregated();
      init(aggregatedOptions);
      //loadSeries();
      emitChange();
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
    
    constr = [template.constructor || 'Chart'];

    //highed.clearObj(templateOptions);

    if (customizedOptions.xAxis) {
      delete customizedOptions.xAxis;
    }

    if (customizedOptions.yAxis) {
      delete customizedOptions.yAxis;
    }

    // highed.setAttr(customizedOptions, 'series', []);
    gc(function(chart) {
      //templateOptions = highed.merge({}, template.config || {});

      templateOptions = [highed.merge({}, template.config || {})];

      updateAggregated();
      init(aggregatedOptions);
      emitChange();
    });
  }


  function loadSeriesFromDataSource(){
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

  function loadSeries() {/*
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
    updateAggregated();*/
  }

  /** Load CSV data
   *  @memberof highed.ChartPreview
   *  @name data.csv
   *  @param data {object} - the data to load
   */
  function loadCSVData(data, emitLoadSignal, cb, skipEmit) {
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
    lastLoadedLiveData = false;
    var axis;

    if (customizedOptions.xAxis) {
      (highed.isArr(customizedOptions.xAxis)
        ? customizedOptions.xAxis
        : [customizedOptions.xAxis]
      ).forEach(function(axis) {
        if (axis.categories) axis.categories = [];
      });
    }

    if (customizedOptions.yAxis) {
      (highed.isArr(customizedOptions.yAxis)
        ? customizedOptions.yAxis
        : [customizedOptions.yAxis]
      ).forEach(function(axis) {
        if (axis.categories) axis.categories = [];
      });
    }

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
        googleSpreadsheetKey: undefined,
        url: data.url
      }
    });

    updateAggregated();

    //init(aggregatedOptions);
    //loadSeries();
    //emitChange();
    
    if (highed.isArr(seriesClones)) {
      (seriesClones || []).forEach(function(series, i) {
        mergedExisting = true;
        if (!customizedOptions.series[i]) {
          addBlankSeries(i, null, null, true);
        }
        highed.merge(customizedOptions.series[i], series);
      });
    }

    if (mergedExisting && !skipEmit) {
      updateAggregated();
      init(aggregatedOptions);
      loadSeries();
      emitChange();
    }

    if (emitLoadSignal) {
      events.emit('LoadProjectData', data.csv);
    }

    if (cb) cb();
      
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

    highed.emit('UIAction', 'LoadProject');
    
    lastLoadedCSV = false;
    lastLoadedSheet = false;
    lastLoadedLiveData = false;

    if (highed.isStr(projectData)) {
      try {
        return loadProject(JSON.parse(projectData));
      } catch (e) {
        highed.snackBar('Invalid project');
      }
    }

    if (projectData) {

      if (projectData.theme && projectData.theme.plugins && projectData.theme.plugins.cssModules) {
        highed.loadModules(projectData.theme.plugins.cssModules);
      }

      if (projectData.settings && projectData.settings.plugins && projectData.settings.plugins.cssModules)
        highed.loadModules(projectData.settings.plugins.cssModules);

      templateOptions = [{}];
      if (projectData.template) {
        if (highed.isArr(projectData.template)) templateOptions = projectData.template;
        else templateOptions = [projectData.template];
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

      events.emit('LoadCustomCode');
      
      constr = ['Chart'];
      var columnLength = 8;

      // Support legacy format
      if (projectData.settings && projectData.settings.templateView) {
        if (projectData.settings.templateView.activeSection === 'stock') {
          constr = ['StockChart'];
        }
      }

      if (projectData.settings && projectData.settings.template) {
        templateSettings = projectData.settings.template;
      }

      if(projectData.settings && projectData.settings.plugins) {
        chartPlugins = projectData.settings.plugins
      }

      if (
        projectData.settings &&
        highed.isStr(projectData.settings.constructor)
      ) {
        constr = [projectData.settings.constructor];
      }

      if (
        projectData.settings &&
        highed.isArr(projectData.settings.constructor)
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
        
        if (projectData.settings.dataProvider.assignDataFields) {
          assignDataFields = projectData.settings.dataProvider.assignDataFields;
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
            if (provider.dataRefreshRate && provider.dataRefreshRate > 0) {
              sheet.dataRefreshRate =
                provider.dataRefreshRate ||
                customizedOptions.data.dataRefreshRate;
              sheet.enablePolling = true;
            }
          }

          events.emit(
            'ProviderGSheet',
            projectData.settings.dataProvider.googleSpreadsheet
          );

          loadGSpreadsheet(sheet);

          hasData = true;
        } else if (projectData.settings.dataProvider.liveData) {
          var provider = projectData.settings.dataProvider;
          var live = provider.liveData;

          loadLiveData(provider.liveData);
        } else if (projectData.settings.dataProvider.csv) {
          // We need to fix potential html-entities as they will mess up separators
          Object.keys(htmlEntities).forEach(function(ent) {
            projectData.settings.dataProvider.csv = projectData.settings.dataProvider.csv.replace(
              new RegExp(ent, 'g'),
              htmlEntities[ent]
            );
          });
            
          var sections = projectData.settings.dataProvider.assignDataFields,
              csv = projectData.settings.dataProvider.csv.replace('&amp;', '&');

          if (sections) {

            projectData.options.data  = projectData.settings.dataProvider;
            sections = highed.getAllMergedLabelAndData(sections);

            if (projectData.options && ((projectData.options.chart && projectData.options.chart.map) || (projectData.options.plotOptions && projectData.options.plotOptions.map)) ){
              highed.chartType = 'Map';
              csv = highed.parseCSV(csv, null, sections)
              .map(function(cols) {
                return cols.join(';');
              }).join('\n');
            } else {
              csv = highed.parseCSV(csv, null, sections);
              
              if (csv[0] && csv[0][0]) {
                columnLength = csv[0].length;
              }

              csv = csv.map(function(cols) {
                return cols.join(';');
              }).join('\n');
            }
            
            projectData.options.data.csv  = csv;
            customizedOptions.data = projectData.options.data;
          } else {
            projectData.options.data  = projectData.settings.dataProvider;
            customizedOptions.data = projectData.options.data;
          }

          hasData = true;
        }
      }

      if (projectData.options && projectData.options.annotations) {
        annotations = projectData.options.annotations.slice()
        //chart.annotations = annotations.slice();
        
        //delete customizedOptions.annotations
      }
      
      // Not sure if this should be part of the project files yet
      // if (projectData.editorOptions) {
      //     Object.keys(projectData.editorOptions, function (key) {
      //         highed.option(key, projectData.editorOptions[key]);
      //     });
      // }

      var isMapChart = projectData.options && ((projectData.options.chart && projectData.options.chart.map) || (projectData.options.plotOptions && projectData.options.plotOptions.map)) ;

      if (isMapChart) {
        if (projectData.options && projectData.options.chart && projectData.options.chart.map && !highed.isObj(projectData.options.chart.map)){
          events.emit('SetChartAsMap');

          var baseMapPath = "https://code.highcharts.com/mapdata/";
          updateMap(projectData.options.chart.map, baseMapPath + projectData.options.chart.map + '.js', function() {
            togglePlugins('map', true);
            events.emit('LoadMapProject', projectData, aggregatedOptions);  
            updateAggregated(null, true);
            init(aggregatedOptions); 
          });
        } else {
          events.emit('SetChartAsMap');
          togglePlugins('map', true);
          events.emit('LoadMapProject', projectData, aggregatedOptions);  
          updateAggregated(null, true);
          init(aggregatedOptions); 
        }

      } else {
        events.emit('LoadProject', projectData, aggregatedOptions, columnLength);
        updateAggregated(null, true);
        init(aggregatedOptions); 
      }
      
      //}
    }
  }

  function loadLiveData(settings) {

    lastLoadedLiveData = settings;

    lastLoadedCSV = false;
    lastLoadedSheet = false;

    highed.merge(customizedOptions, {
      data: lastLoadedLiveData
    });

    events.emit('ProviderLiveData', settings);
    updateAggregated();
    init(aggregatedOptions);

    loadSeries();
    emitChange();

    // The sheet will be loaded async, so we should listen to the load event.
    gc(function(chart) {
      var found = Highcharts.addEvent(chart, 'load', function() {
        loadSeriesFromDataSource();
        found();
      });
    });

  }

  function loadGSpreadsheet(options) {
    var key;

    lastLoadedCSV = false;
    lastLoadedSheet = options;

    lastLoadedSheet.googleSpreadsheetKey =
      lastLoadedSheet.googleSpreadsheetKey || lastLoadedSheet.id;
    lastLoadedSheet.googleSpreadsheetWorksheet =
      lastLoadedSheet.googleSpreadsheetWorksheet || lastLoadedSheet.worksheet;

    if (options && (options.googleSpreadsheetKey || '').indexOf('http') === 0) {
      // Parse out the spreadsheet ID
      // Located between /d/ and the next slash after that
      key = options.googleSpreadsheetKey;
      key = key.substr(key.indexOf('/d/') + 3);
      key = key.substr(0, key.indexOf('/'));

      options.googleSpreadsheetKey = key;
    }

    highed.merge(customizedOptions, {
      data: lastLoadedSheet
    });

    if (highed.chartType === 'Map' && customizedOptions.series) {
      addBlankSeries(customizedOptions.series.length,null,{
        joinBy: null
      });
    }

    updateAggregated();
    init(aggregatedOptions);
    loadSeries();
    emitChange();
    // The sheet will be loaded async, so we should listen to the load event.
    gc(function(chart) {
      var found = Highcharts.addEvent(chart, 'load', function() {
        loadSeriesFromDataSource();
        //loadSeries();
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
      livedata = lastLoadedLiveData,
      themeData = false,
      seriesMapping = false;
    if (
      (chart &&
      chart.options &&
      chart.options.data &&
      chart.options.data.csv) || 
      dataTableCSV !== null
    ) {
      loadedCSVRaw = dataTableCSV || (chart.options.data ? chart.options.data.csv : '');

      if (chart.options.data && chart.options.data.seriesMapping) {
        seriesMapping = chart.options.data.seriesMapping;
      }
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
      assignDataFields = false;
    }

    if (chart &&
        chart.options &&
        chart.options.data &&
        chart.options.data.url
      ) {
        livedata = {
          url: chart.options.data.url,
          interval: chart.options.data.interval,
          type: chart.options.data.type
        };
        assignDataFields = false;
    }

    if (themeMeta && themeMeta.id && themeOptions) {
      themeData = {
        id: themeMeta.id,
        name: themeMeta.name,
        options: themeOptions || {},
        customCode: themeCustomCode || '',
        plugins: themeMeta.plugins
      };
    }
    
    if (chart && chart.options && chart.options.annotations) {
      chartPlugins.annotations = 1;
    }

    getAnnotations()

    return {
      template: templateOptions,
      options: getCleanOptions(customizedOptions),
      customCode: highed.isFn(customCode) ? customCodeStr : '',
      theme: themeData,
      settings: {
        constructor: constr,
        template: templateSettings,
        plugins: chartPlugins,//getPlugins(),
        dataProvider: {
          csv: !gsheet && !livedata ? loadedCSVRaw || lastLoadedCSV : false,
          googleSpreadsheet: gsheet,
          liveData: livedata,
          assignDataFields: assignDataFields,
          seriesMapping: seriesMapping
        }
      }
      //editorOptions: highed.serializeEditorOptions()
    };
  }

  function getAnnotations() {
    
    var navigation = chart.navigationBindings,
    navChart = navigation.chart;

    customizedOptions.annotations = [];

    navChart.annotations.forEach(function(annotation, index) {
      /*
      if (!customizedOptions.annotations) {
        customizedOptions.annotations = []
      }*/

      if (annotation.userOptions && (annotation.userOptions.type === 'crookedLine' || annotation.userOptions.type === 'elliottWave')) {
        annotation.userOptions.typeOptions.line = highed.merge({}, annotation.shapes[0].options);
      }

      customizedOptions.annotations.push(annotation.userOptions);
    });

  }

  function getTemplateSettings() {
    return templateSettings;
  }

  function clearData(skipReinit) {
    lastLoadedCSV = false;
    lastLoadedSheet = false;
    lastLoadedLiveData = false;

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
        templateOptions = [{}];
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
   * Set Data table CSV as user could have unused columns that need saving too.
   */

  function setDataTableCSV(csv) {
    dataTableCSV = csv;
  }

  /**
   * Set Assign Data fields from datatable
   */

  function setAssignDataFields(fields) {
    assignDataFields = fields;
  }


  /**
   * Add/Remove a module from the charts config
   */

  function togglePlugins(groupId, isNewValue, type) {
    
    if (type && type === 'css') {
      if (!chartPlugins['cssModules']) chartPlugins.cssModules = [];
      if (!chartPlugins.cssModules.some(function(mod) {
        return mod === isNewValue;
      })) chartPlugins.cssModules.push(isNewValue);

    } else if (isNewValue) {
      chartPlugins[groupId] = isNewValue || 1;
    } else {
      delete chartPlugins[groupId];
    }
  }

  /**
   * Load raw dataset (array of arrays)
   */
  //function

  /** Set chart options from an object
   *
   */
  function setChartOptions(options, skipEmit) {

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

    if (!skipEmit) {
      updateAggregated();
      init(aggregatedOptions, false, true);
      emitChange();
    }

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
    } else if (lastLoadedLiveData) {
      highed.merge(r, {
        data: lastLoadedLiveData,
        googleSpreadsheetKey: false,
        googleSpreadsheetWorksheet: false
      });
    } else if (lastLoadedCSV) {
      highed.merge(r, {
        data: {
          csv: lastLoadedCSV,
          googleSpreadsheetKey: false,
          googleSpreadsheetWorksheet: false,
          seriesMapping: (customizedOptions && customizedOptions.data && customizedOptions.data.seriesMapping ? customizedOptions.data.seriesMapping : null)
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
          'https://code.highcharts.com/modules/funnel.js',
          'https://code.highcharts.com/modules/annotations.js',
          'https://code.highcharts.com/stock/modules/annotations-advanced.js',
          'https://code.highcharts.com/stock/modules/stock-tools.js',
          'https://code.highcharts.com/modules/accessibility.js',
          // 'https://code.highcharts.com/modules/series-label.js'
          'https://code.highcharts.com/modules/solid-gauge.js'
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

      const chartConstr = (constr.some(function(a) {
        return a === 'StockChart';
      }) ? 'StockChart' : 'Chart');

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
          'new Highcharts.' + chartConstr + '("',
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

    templateOptions = [];
    highed.clearObj(customizedOptions);
    highed.clearObj(flatOptions);

    customCode = false;

    // highed.merge(customizedOptions, properties.defaultChartOptions);

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
    return (constr.some(function(a) {
      return a === 'StockChart';
    }) ? 'StockChart' : 'Chart');
  }

  function getTheme() {
    return {
      id: themeMeta.id,
      name: themeMeta.name,
      options: themeOptions,
      plugins: themeMeta.plugins
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
          'if (options.zAxis && options.zAxis.length === 1) options.zAxis = options.zAxis[0];',
          'if (!options.series || options.series.length === 0) return;',
          'var encodedUrl = "";',
           themeCustomCode
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
      
      if (!customizedOptions.data || (customizedOptions 
         && customizedOptions.data 
         && !customizedOptions.data.googleSpreadsheetKey)) {
        init(aggregatedOptions);
      }

      emitChange();
    }
  }

  function setIsAnnotating(isAnnotate) {
    isAnnotating = isAnnotate
  }

  function updateAnnotation(config, type) {

    if (type === 'line') {
      chart.currentAnnotation.shapes[0].update(config);
      chart.currentAnnotation.userOptions.typeOptions.line.stroke = config.stroke;
      chart.currentAnnotation.userOptions.typeOptions.line.strokeWidth = config.strokeWidth;
    } else if (type === 'verticalCounter') {
      //There must be a better way to do this
      chart.currentAnnotation.shapes[0].update(config);
      chart.currentAnnotation.labels[0].update(config);
      
      chart.currentAnnotation.userOptions.typeOptions.label.text = config.text;
      chart.currentAnnotation.userOptions.typeOptions.connector.stroke = config.stroke;
      chart.currentAnnotation.userOptions.typeOptions.connector.fill = config.stroke;
      chart.currentAnnotation.userOptions.typeOptions.connector.strokeWidth = config.strokeWidth;
    } 
    else chart.currentAnnotation.update(config);
    
    chart.annotationsPopupContainer.style.display = 'none';
  }

  function updateMapData(data, code, name) {
    if (!code || code === '') code = 'hc-key';
    if (!name || name === '') name = 'name';
    
    if (data) {
      data.hccode = code;
      data.hcname = name;
    }

    if (!customizedOptions.chart) customizedOptions.chart = {};

    //customizedOptions.plotOptions.map.mapData = data;
    if (data) customizedOptions.chart.map = data;

    customizedOptions.series.forEach(function(s){
      s.joinBy = [code, code];
    })
    //customizedOptions.series[0].joinBy = [code, code];
  }

  function updateMap(path, scriptSrc, callback) {

    if (customizedOptions && !customizedOptions.chart) {
      customizedOptions.chart = {}
    }

    customizedOptions.chart.map = path;
    
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = scriptSrc

    s.onload = s.onreadystatechange = function( _, isAbort ) {
      if(isAbort || !s.readyState || /loaded|complete/.test(s.readyState) ) {
        s.onload = s.onreadystatechange = null;
        s = undefined;

        if(!isAbort && callback) setTimeout(callback, 0);
      }
    };

    document.getElementsByTagName('head')[0].appendChild(s);
    
    updateAggregated();
    //init(aggregatedOptions);
  }
  ///////////////////////////////////////////////////////////////////////////

  function addBlankSeries(index, type, extra, skipEmit) {
    
    if (!extra) {
      extra = {};
    }

    if (!customizedOptions.series) {
      customizedOptions.series = [];
    }

    if (!customizedOptions.series[index]) {
      customizedOptions.series[index] = highed.merge({
        data:[],
        turboThreshold: 0,
        _colorIndex: index,
        _symbolIndex: 0,
        compare: undefined
      }, extra);
    }

    if(type) customizedOptions.series[index].type = type;
    
    if (extra) {
      customizedOptions.series[index] = highed.merge(customizedOptions.series[index], extra);
    }

    //Init the initial chart
    if (skipEmit) return;

    updateAggregated();
    init();
  }
  ///////////////////////////////////////////////////////////////////////////

  //Init the initial chart
  updateAggregated();

  highed.dom.on(toggleButton, 'click', function() {
    return expanded ? collapse() : expand();
  });

  ///////////////////////////////////////////////////////////////////////////

  exports = {
    assignTheme: assignTheme,
    clearTheme: clearTheme,
    getTheme: getTheme,
    getConstructor: getConstructor,
    on: events.on,
    expand: expand,
    collapse: collapse,
    new: newChart,
    changeParent: changeParent,

    getHighchartsInstance: gc,

    loadTemplate: loadTemplate,
    loadTemplateForSerie: loadTemplateForSerie,
    loadSeries: loadSeriesData,
    resize: resize,

    setCustomCode: setCustomCode,
    getCustomCode: getCustomCode,

    toProject: toProject,
    toProjectStr: toProjectStr,
    loadProject: loadProject,
    redraw: init,

    toString: toString,
    setIsAnnotating: setIsAnnotating,
    toggleShowAnnotationIcon: toggleShowAnnotationIcon,
    updateAnnotation: updateAnnotation,
    closeAnnotationPopup: closeAnnotationPopup,

    updateMapCodes: updateMapCodes,
    init: init,

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
      getPreview: getCodePreview,
      all: function(){
        return chart;
      },
      addBlankSeries: addBlankSeries,
      togglePlugins: togglePlugins,
      getTemplateSettings: getTemplateSettings,
      updateMap: updateMap
    },

    data: {
      csv: loadCSVData,
      json: loadJSONData,
      settings: loadChartSettings,
      export: exportChart,
      gsheet: loadGSpreadsheet,
      clear: clearData,
      live: loadLiveData,
      setDataTableCSV: setDataTableCSV,
      setAssignDataFields: setAssignDataFields,
      deleteSerie: deleteSerie,
      deleteSeries: deleteSeries,
      updateMapData: updateMapData
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
