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

/* global window */

highed.DataPage = function(parent, options, chartPreview, chartFrame, props) {
  var events = highed.events(),
    // Main properties
    properties = highed.merge(
      {
        defaultChartOptions: {},
        useHeader: true,
        features: [
          'data',
          'templates',
          'customize',
          'customcode',
          'advanced',
          'export'
        ],
        importer: {},
        dataGrid: {},
        customizer: {},
        toolbarIcons: []
      },
      options
    ),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    title = highed.dom.cr('div', 'highed-dtable-title'),
    chartTitle = highed.dom.cr('div', 'highed-toolbox-body-chart-title'),
    chartTitleInput = highed.dom.cr('input', 'highed-toolbox-chart-title-input'),
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents highed-toolbox-dtable'
    ),
    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon,
    icon = highed.dom.cr('div', iconClass),
    helpModal = highed.HelpModal(props.help || []),
    // Data table
    dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-datapage-body highed-box-size highed-transition'
    ),
    dataTable = highed.DataTable(
      dataTableContainer,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.dataGrid
      )
    ),   
    addRowInput = highed.dom.cr('input', 'highed-field-input highed-add-row-input'),
    addRowBtn = highed.dom.cr('button', 'highed-import-button highed-ok-button highed-add-row-btn small', 'Add'),
    addRowDiv = highed.dom.ap(highed.dom.cr('div', 'highed-dtable-extra-options'),
                highed.dom.ap(highed.dom.cr('div', 'highed-add-row-container'),     
                  highed.dom.cr('span', 'highed-add-row-text highed-hide-sm', 'Add Rows'),            
                  addRowInput,
                  addRowBtn
                )
              ),
    assignDataPanel = highed.AssignDataPanel(parent, dataTable),
    dataImportBtn = highed.dom.cr(
      'button',
      'highed-import-button highed-ok-button highed-sm-button',
      'Import');
    dataExportBtn = highed.dom.cr(
      'button',
      'highed-import-button highed-ok-button highed-hide-sm',
      'Export Data');
    dataClearBtn = highed.dom.cr(
      'button',
      'highed-import-button highed-ok-button highed-sm-button',
       highed.L('dgNewBtn')),
    blacklist = [
      'candlestick',
      'bubble',
      'tilemap',
      'pie'
    ];

    dataImportBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';
    dataClearBtn.innerHTML += ' <span class="highed-hide-sm">Data</span>';
    
    addRowInput.value = 1;
    highed.dom.on(addRowBtn, 'click', function(e) {
      assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
      for(var i=0;i<addRowInput.value; i++) {
        dataTable.addRow();
      }
      assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    });

    highed.dom.on(dataImportBtn, 'click', function() {
      dataTable.showImportModal(0);
    }),
    highed.dom.on(dataExportBtn, 'click', function() {
      dataTable.showImportModal(1);
    }),
    
    highed.dom.on(dataClearBtn, 'click', function() {
      if (confirm('Start from scratch?')) {
        dataTable.clearData();
        assignDataPanel.init();
      }
    }),
    
    iconsContainer = highed.dom.cr('div', 'highed-toolbox-icons'),
    isVisible = true;

    function init() {

      if (!highed.onPhone()) {
        highed.dom.ap(iconsContainer, addRowDiv, dataClearBtn, dataImportBtn, dataExportBtn);
      } else {
        highed.dom.ap(iconsContainer, dataImportBtn);
      }

      highed.dom.ap(contents, highed.dom.ap(title, highed.dom.ap(chartTitle, chartTitleInput), iconsContainer), userContents);
      highed.dom.ap(body, contents);
  
      highed.dom.ap(userContents, dataTableContainer);
      dataTable.resize();

      if (highed.onPhone()){
        highed.dom.style(body, {
          top: '47px',
          position: 'relative'
        });
      }
      
      highed.dom.ap(parent, highed.dom.ap(container, body));
      
      assignDataPanel.init(dataTable.getColumnLength());
      if (highed.chartType === 'Map') assignDataPanel.disableMaps();
      expand();
      resizeChart();
    }

    function afterResize(func){
      var timer;
      return function(event){
        if(timer) clearTimeout(timer);
        timer = setTimeout(func,100,event);
      };
    }

    function resize() {
      if (isVisible) {
        resizeChart();
        setTimeout(function(){
          expand()
        }, 100);
        //expand();
      }
    }

    function showHelp() {
      helpModal.show();
    }

    function expand() {
      
      chartPreview.toggleShowAnnotationIcon(false);
      //var bsize = highed.dom.size(bar);

      var newWidth = props.widths.desktop;
      if (highed.onTablet() && props.widths.tablet) newWidth = props.widths.tablet;
      else if (highed.onPhone() && props.widths.phone) newWidth = props.widths.phone;

      if (props.iconOnly) {
        return;
      }

      highed.dom.style(body, {
        width: 100 + '%',
        //height: //(bsize.h - 55) + 'px',
        opacity: 1
      });

      if (!highed.onPhone()) {
        //(highed.dom.pos(assignDataPanel.getElement(), true).x - highed.dom.pos(dataTableContainer, true).x) - 10
        highed.dom.style(container, {        
          //width: newWidth + '%'
          width:((highed.dom.pos(assignDataPanel.getElement(), true).x - highed.dom.pos(dataTableContainer, true).x) + 14) + 'px'
        });
      }

      events.emit('BeforeResize', newWidth);

      function resizeBody() {
        var bsize = highed.dom.size(body),
            tsize = highed.dom.size(title),
            size = {
              w: bsize.w,
              h: (window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight) - highed.dom.pos(body, true).y
            };
          
        highed.dom.style(contents, {
          width: '100%',
          height: ((size.h - 16)) + 'px'
        });

        dataTable.resize();   
        if(!highed.onPhone()) assignDataPanel.resize(newWidth, highed.dom.pos(chartFrame, true).y - highed.dom.pos(body, true).y)
      }

      setTimeout(resizeBody, 300);
      highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

    function show() {
      chartPreview.toggleShowAnnotationIcon(false);
      highed.dom.style(container, {
        display: 'block'
      });
      assignDataPanel.show();
      isVisible = true;
      resizeChart();
      resize(); 
    }

    function hide() {
      highed.dom.style(container, {
        display: 'none'
      });
      assignDataPanel.hide();
      isVisible = false;
    }

    function destroy() {}

    function addImportTab(tabOptions) {
      dataTable.addImportTab(tabOptions);
    }

    function hideImportModal() {
      dataTable.hideImportModal();
    }
    
    function changeAssignDataTemplate(newTemplate, loadTemplateForEachSeries, cb) {
      
      if (dataTable.isInCSVMode()) {
        
        clearSeriesMapping();        
        
        var seriesIndex = [];
        assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, null, true);
        if (loadTemplateForEachSeries) {
          const length = assignDataPanel.getAllOptions().length;
          
          for(var i=0;i<length;i++) {
            seriesIndex.push(i);
            assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength(), null, i, true, i + 1);
          }
        } else seriesIndex = [assignDataPanel.getActiveSerie()];

        chartPreview.loadTemplateForSerie(newTemplate, seriesIndex);

        const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
        
        chartPreview.data.csv({
          csv: data
        }, null, false, function() {
          setSeriesMapping(assignDataPanel.getAllOptions());
          redrawGrid(true);
          if (cb) cb();
        });
      } else {
        chartPreview.loadTemplate(newTemplate);
      }

      //assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    }

    function getIcons() {
      return null;
    }

    function setChartTitle(title) {
      chartTitleInput.value = title;
    }

    function showDataTableError() {
      dataTable.showDataTableError();
    }

    function hideDataTableError() {
      dataTable.hideDataTableError();
    }

    function getChartTitle() {
      return chartTitleInput.value;
    }

    function clearSeriesMapping() {

      var chartOptions = chartPreview.options.getCustomized();
      if (chartOptions.data && chartOptions.data.seriesMapping) {
        // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
        chartOptions.data.seriesMapping = null;
        chartPreview.options.setAll(chartOptions);  
      }

    }
    function setSeriesMapping(allOptions) {

      var tempOption = [],
          chartOptions = chartPreview.options.getCustomized(),
          dataTableFields = dataTable.getDataFieldsUsed(),
          hasLabels = false;
      
      var series = allOptions.length;

      for(var i = 0; i < series; i++) {
        var serieOption = {};
        Object.keys(allOptions[i]).forEach(function(key) {
          const option = allOptions[i][key];
          if (option.value !== '') {
            if (option.isData) { //(highed.isArr(option)) { // Data assigndata
              if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                var linkedTo = highed.isArr(option.linkedTo) ? option.linkedTo : [option.linkedTo];
                linkedTo.forEach(function(linked){
                  serieOption[linked] = dataTableFields.indexOf(option.rawValue[0]);
                });
              }
            } else {
              if (option.linkedTo === 'label') hasLabels = true;
              if (dataTableFields.indexOf(option.rawValue[0]) > -1) {
                serieOption[option.linkedTo] = dataTableFields.indexOf(option.rawValue[0]);
              }
              //serieOption[option.linkedTo] = option.rawValue[0];
            }
          }
        });
        tempOption.push(serieOption);
      };
      
      if (tempOption.length > 0) {
        if (hasLabels) {
          const dataLabelOptions = {
            dataLabels: {
                enabled: true,
                format: '{point.label}'
            }
          };

          if(chartOptions.plotOptions) {
            const seriesPlotOptions = chartOptions.plotOptions.series;
            highed.merge(seriesPlotOptions, dataLabelOptions);
            chartPreview.options.setAll(chartOptions);
          } else {
            chartPreview.options.setAll(highed.merge({
              plotOptions: {
                series: dataLabelOptions
              }
            }, chartOptions));
          }
        }

        if (chartOptions.data) {
          chartOptions.data.seriesMapping = tempOption;
          chartPreview.options.setAll(chartOptions);
        }
      }
    }

    function redrawGrid(clearGridFirst) {
      if (clearGridFirst) {
        var columns = [];
        for(var i = 0; i < dataTable.getColumnLength(); i++) {
          columns.push(i);
        }
        dataTable.removeAllCellsHighlight(null, columns);
      }
      
      assignDataPanel.checkToggleCells();
      
      assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true, true);
      chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
    }

    function loadMapProject(projectData, aggregated) {
      var baseMapPath = "https://code.highcharts.com/mapdata/";
      chartPreview.options.updateMap(projectData.options.chart.map, baseMapPath + projectData.options.chart.map + '.js', function() {
        highed.ajax({
          url: baseMapPath + projectData.options.chart.map + '.geo.json',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            loadMapData(data.features, null, null, projectData.settings.dataProvider.csv, function () {
              assignDataPanel.setAssignDataFields(projectData, dataTable.getColumnLength(), true, null, true, true, aggregated);
              assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
              chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData()));
            });
          },
          error: function(e) {
          }
        })
      });
    }

    function loadProject(projectData, aggregated) {
      if (projectData.settings && projectData.settings.dataProvider && projectData.settings.dataProvider.csv) {
        
        dataTable.loadCSV({
          csv: projectData.settings.dataProvider.csv
        }, null, null, function() {
            if (highed.chartType !== 'Map') assignDataPanel.enable();
            assignDataPanel.setAssignDataFields(projectData, dataTable.getColumnLength(), true, null, true, true, aggregated);
            assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
            chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData()));
        });

        //chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
      }
    }

    function loadSampleData(data){
      dataTable.loadSampleData(data);
    }

    function addSerie(type, extra) {
      assignDataPanel.addNewSerie(type, extra);
    }

  //////////////////////////////////////////////////////////////////////////////

  highed.dom.on(window, 'resize', afterResize(function(e){
    resize();
  }));

  assignDataPanel.on('RemoveSeries', function(length) {
    clearSeriesMapping();

    chartPreview.data.deleteSeries(length);
    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

    chartPreview.data.csv({
      csv: data
    }, null, false, function() {
      

      var chartOptions = chartPreview.options.getCustomized();
      var assignDataOptions = assignDataPanel.getAllOptions();    
      
      if (chartOptions && chartOptions.series) {
        if (chartOptions.series.length < assignDataOptions.length) {
          var optionsLength = chartOptions.series.length
          var assignDataOptionsLength = assignDataOptions.length
          var type

          if (chartOptions.series.length != 0) type = chartOptions.series[chartOptions.series.length - 1].type;
          if (blacklist.includes(type)) type = null;

          for(var i=optionsLength; i<assignDataOptionsLength; i++) {
            chartPreview.options.addBlankSeries(i, type);
          }
        }
      }

      setSeriesMapping(assignDataPanel.getAllOptions());
    });
  });

  assignDataPanel.on('GoToTemplatePage', function() {
    events.emit("GoToTemplatePage");
  })
  
  assignDataPanel.on('AddSeries', function(index, type, extra) {
    chartPreview.options.addBlankSeries(index, type, extra);
  })
  
  assignDataPanel.on('GetLastType', function() {
    var chartOptions = chartPreview.options.getCustomized();
    var type = chartOptions.series[chartOptions.series.length - 1].type;

    if (blacklist.includes(type)) type = null;

    assignDataPanel.setColumnLength(dataTable.getColumnLength());
    assignDataPanel.addNewSerie(type);
    
  })
  
  chartPreview.on('LoadProjectData', function(csv) {
    dataTable.loadCSV(
      {
        csv: csv
      },
      true
    );
  });

  chartPreview.on('ChartChange', function(newData) {
    events.emit('ChartChangedLately', newData);
  });

  assignDataPanel.on('DeleteSeries', function(index) {
    clearSeriesMapping();
    chartPreview.data.deleteSerie(index);

    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
    chartPreview.data.csv({
      csv: data
    }, null, false, function() {
      setSeriesMapping(assignDataPanel.getAllOptions());
    });

  });

  assignDataPanel.on('SeriesChanged', function(index) {
    events.emit('SeriesChanged', index);
  });

  assignDataPanel.on('ToggleHideCells', function(options, toggle) {
    var userActiveCells = Object.keys(options).filter(function(key) {
      if(options[key].rawValue && options[key].rawValue.length > 0) return true;
    }).map(function(key) {
      return options[key].rawValue[0]
    });

    dataTable.toggleUnwantedCells(userActiveCells, toggle);

  });

  assignDataPanel.on('AssignDataChanged', function() {
    
    clearSeriesMapping();
    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
    chartPreview.data.csv({
      csv: data
    }, null, false, function() {
      setSeriesMapping(assignDataPanel.getAllOptions());
    });

    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

    //dataTable.highlightSelectedFields(input);
  });

  assignDataPanel.on('RedrawGrid', function(clearGridFirst) {
    redrawGrid(clearGridFirst);
  });

  assignDataPanel.on('ChangeData', function(allOptions) {
    //Series map all of the "linkedTo" options
    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());
    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());

    chartPreview.data.csv({
      csv: data
    }, null, false, function() {
      setSeriesMapping(allOptions);
    });
  });

  dataTable.on('ResetAssignValues', function(values){
    assignDataPanel.setValues(values, 1);
  });

  dataTable.on('DisableAssignDataPanel', function() {
    assignDataPanel.disable();
  });

  dataTable.on('EnableAssignDataPanel', function() {
    if (highed.chartType !== 'Map') assignDataPanel.enable();
  });

  dataTable.on('ColumnMoving', function() {
    //assignDataPanel.resetValues();
    assignDataPanel.getFieldsToHighlight(dataTable.removeAllCellsHighlight, true);
  });

  dataTable.on('ColumnMoved', function() {
    //assignDataPanel.resetValues();
    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
  });

  dataTable.on('InitLoaded', function() {
    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    //dataTable.highlightSelectedFields(assignDataPanel.getOptions());
  });

  dataTable.on('initExporter', function(exporter){
    exporter.init(
      chartPreview.export.json(),
      chartPreview.export.html(),
      chartPreview.export.svg(),
      chartPreview
    );
  });

  dataTable.on('AssignDataForFileUpload', function(rowsLength) {

    if (!rowsLength) rowsLength = dataTable.getColumnLength(); //Remove first column for the categories, and second as its already added
    assignDataPanel.setColumnLength(rowsLength);
    rowsLength -= 2;

    var chartOptions = chartPreview.options.getCustomized();
    var type = chartOptions.series[chartOptions.series.length - 1].type;

    if (!blacklist.includes(type)) {
      assignDataPanel.addSeries(rowsLength, type);
    }
  }); 

  dataTable.on('AssignDataChanged', function(input, options) {
    chartOptions = chartPreview.toProject().options;
    if (chartOptions.data && chartOptions.data.seriesMapping) { 
      // Causes an issue when a user has added a assigndata input with seriesmapping, so just clear and it will add it in again later
      chartOptions.data.seriesMapping = null;
      chartPreview.options.setAll(chartOptions);  
    }

    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
    return chartPreview.data.csv({
      csv: dataTable.toCSV(';', true, options)
    });
  });

  dataTable.on('LoadLiveData', function(settings) {
    //chartPreview.data.live(settings);

    const liveDataSetting = {};

    liveDataSetting[settings.type] = settings.url;
    if (settings.interval && settings.interval > 0){
      liveDataSetting.enablePolling = true;
      liveDataSetting.dataRefreshRate = settings.interval
    }
    chartPreview.data.live(liveDataSetting);
  });
/*
  dataTable.on('UpdateLiveData', function(p){
    chartPreview.data.liveURL(p);
  });
*/

  dataTable.on('LoadGSheet', function(settings) {
    assignDataPanel.disable();
    setSeriesMapping(assignDataPanel.getAllOptions());
    chartPreview.data.gsheet(settings);
  });
  
  dataTable.on('Change', function(headers, data) {

    chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true));

    chartPreview.data.csv({
      csv: dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData())
    }, null, true, function() {
      setSeriesMapping(assignDataPanel.getAllOptions()); // Not the most efficient way to do this but errors if a user just assigns a column with no data in.
    });
  });

  dataTable.on('ClearData', function() {
    chartPreview.data.clear();
  });

  dataTable.on('ClearSeriesForImport', function() {
    var options = chartPreview.options.getCustomized();
    options.series = [];
    assignDataPanel.restart();
  });

  dataTable.on('SetupAssignData', function(assigns) {
    assignDataPanel.setValues(assigns);
  })

  dataTable.on('ClearSeries', function() {
    var options = chartPreview.options.getCustomized();
    options.series = [];
  });

  chartPreview.on('ProviderGSheet', function(p) {
    assignDataPanel.disable();
    dataTable.initGSheet(
      p.id || p.googleSpreadsheetKey,
      p.worksheet || p.googleSpreadsheetWorksheet,
      p.startRow,
      p.endRow,
      p.startColumn,
      p.endColumn,
      true,
      p.dataRefreshRate
    );

    setSeriesMapping(assignDataPanel.getAllOptions());
  });

  chartPreview.on('ProviderLiveData', function(p) {
    assignDataPanel.disable();
    dataTable.loadLiveDataPanel(p);
  });

  function createSimpleDataTable(toNextPage, cb, chartContainer) {
    return dataTable.createSimpleDataTable(toNextPage, cb, chartContainer);
  } 

  function selectSwitchRowsColumns() {
    dataTable.selectSwitchRowsColumns()
  }

  function loadMapData(data, code, name, csv, cb) {
    dataTable.loadMapData(data, code, name, csv, cb);
  }

  function resizeChart(newWidth) {
    highed.dom.style(chartFrame, {
      /*left: newWidth + 'px',*/
      width: '28%',
      height: '38%'
    });
    chartPreview.resize();

    setTimeout(function() { chartPreview.resize(); }, 200);
  }
  chartPreview.on('SetResizeData', function () {
    //setToActualSize();
  });

  function getMapValueFromCode(key) {
    return dataTable.getMapValueFromCode(key, assignDataPanel.getMergedLabelAndData());
  }

  function changeAssignDataType(type) {
    assignDataPanel.changeAssignDataType(type);
  }

  function showMapDataTable() {
    dataTable.showMapDataTable();
  }

  return {
    on: events.on,
    destroy: destroy,
    addImportTab: addImportTab,
    hideImportModal: hideImportModal,
    chart: chartPreview,
    resize: resize,
    data: {
      on: dataTable.on,
      showLiveStatus: function(){}, //toolbox.showLiveStatus,
      hideLiveStatus: function(){}//toolbox.hideLiveStatus
    },
    hide: hide,
    show: show,
    dataTable: dataTable,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    setChartTitle: setChartTitle,
    getChartTitle: getChartTitle,
    getIcons: getIcons,
    changeAssignDataTemplate: changeAssignDataTemplate,
    createSimpleDataTable: createSimpleDataTable,
    loadProject: loadProject,
    loadMapProject: loadMapProject,
    showDataTableError: showDataTableError,
    hideDataTableError: hideDataTableError,
    selectSwitchRowsColumns: selectSwitchRowsColumns,
    loadMapData: loadMapData,
    loadSampleData: loadSampleData,
    addSerie: addSerie,
    getMapValueFromCode: getMapValueFromCode,
    changeAssignDataType: changeAssignDataType,
    showMapDataTable: showMapDataTable
  };
};