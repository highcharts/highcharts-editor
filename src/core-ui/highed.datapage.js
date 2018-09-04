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
    title = highed.dom.cr('div', 'highed-toolbox-body-title'),
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
    assignDataPanel = highed.AssignDataPanel(parent),
    // Data table
    dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
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
    dataImportBtn = highed.dom.cr(
      'button',
      'highed-import-button highed-ok-button ',
      'Import/Export');
    dataClearBtn = highed.dom.cr(
      'button',
      'highed-import-button highed-ok-button ',
       highed.L('dgNewBtn'));
    

    highed.dom.on(dataImportBtn, 'click', function() {
      dataTable.showImportModal();
    }),
    iconsContainer = highed.dom.cr('div', 'highed-toolbox-icons'),
    isVisible = true;

    function init() {

      highed.dom.ap(contents, highed.dom.ap(title, highed.dom.ap(chartTitle, chartTitleInput), highed.dom.ap(iconsContainer, dataClearBtn, dataImportBtn)), userContents);
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

      expand();
      resizeChart();
    }

    function resize() {
      if (isVisible) {
        resizeChart();
        expand();
      }
    }

    highed.dom.on(window, 'resize', resize);
    

    function showHelp() {
      helpModal.show();
    }

    function expand() {
      //var bsize = highed.dom.size(bar);

      var newWidth = props.widths.desktop;
      if (highed.onTablet() && props.widths.tablet) newWidth = props.widths.tablet;
      else if (highed.onPhone() && props.widths.phone) newWidth = props.widths.phone;
/*
      if (expanded && activeItem === exports) {
        return;
      }
*/
      if (props.iconOnly) {
        return;
      }
/*
      if (activeItem) {
        activeItem.disselect();
      }
*/
 //     entryEvents.emit('BeforeExpand');

   //   body.innerHTML = '';
   //   highed.dom.ap(body, contents);

   //console.log(bsize.h);
      highed.dom.style(body, {
        width: 100 + '%',
        //height: //(bsize.h - 55) + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + '%'
      });

      events.emit('BeforeResize', newWidth);

     // expanded = true;



     function resizeBody() {
       /*
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: bsize.h - tsize.h - 55
        };

      highed.dom.style(contents, {
        width: size.w + 'px',
        height: size.h + 'px'
      });

      return size;*/

      var bsize = highed.dom.size(body),
      tsize = highed.dom.size(title),
      size = {
        w: bsize.w,
        h: (window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y
      };
        
      highed.dom.style(contents, {
        width: size.w + 'px',
        height: ((size.h - 16)) + 'px'
      });

      dataTable.resize(newWidth, (size.h - 17 - 55) - tsize.h);   
      if(!highed.onPhone()) assignDataPanel.resize(newWidth, highed.dom.pos(chartFrame, true).y - highed.dom.pos(body, true).y)
     }

    setTimeout(resizeBody, 300);
    /*
      setTimeout(function() {
        var height = resizeBody().h;

        dataTable.resize(newWidth, height - 20);     
        highed.dom.style(body, {
          height: (height + highed.dom.size(title).h) + 'px',
        });
        highed.dom.style(contents, {
          height: height + 'px',
        });
  
        //entryEvents.emit('Expanded', newWidth, height - 20);
      }, 300);  */

      highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
    assignDataPanel.show();
    isVisible = true;
    resizeChart();
    //expand();
    
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
  
  function changeAssignDataTemplate(newTemplate) {
    /*
    const oldValues = assignDataPanel.getAllMergedLabelAndData();
    dataTable.removeAllCellsHighlight(null, [oldValues.labelColumn].concat(oldValues.dataColumns).sort());
    */

    assignDataPanel.setAssignDataFields(newTemplate, dataTable.getColumnLength());
    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

    setSeriesMapping(assignDataPanel.getAllOptions());
    setTimeout(function() {
      chartPreview.data.csv({
        csv: data
      });
      chartPreview.loadTemplateForSerie(newTemplate, assignDataPanel.getActiveSerie());
    }, 500);

    redrawGrid(true);

    //assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
  }

  function getIcons() {
    return null;
  }

  function setChartTitle(title) {
    chartTitleInput.value = title;
  }

  function getChartTitle() {
    return chartTitleInput.value;
  }

  function setSeriesMapping(allOptions) {

    var tempOption = [],
        chartOptions = chartPreview.toProject().options,
        dataTableFields = dataTable.getDataFieldsUsed();
    
    var dataValues  = allOptions.data,
        series = allOptions.length;
/*
    dataValues.forEach(function(data) {
      if (data.multipleValues) {
        series = (data.rawValue[data.rawValue.length - 1] - data.rawValue[0]) + 1;
      }
    });
*/
    for(var i = 0; i < series; i++) {

      var serieOption = {};
      Object.keys(allOptions[i]).forEach(function(key) {
        const option = allOptions[i][key];
        if (option.value !== '') {
          if (highed.isArr(option)) { // Data assigndata
            //serieOption['y'] = dataTableFields.indexOf(option[0].rawValue[0]);
            option.forEach(function(data) {
              if (dataTableFields.indexOf(data.rawValue[0]) > -1) serieOption[data.linkedTo] = dataTableFields.indexOf(data.rawValue[0]); //data.rawValue[0];
            });
            /*
            if (series > 1) {
              serieOption['y'] = option[0].rawValue[0]  //(option[0].rawValue[0] + i); // TODO: Change this later to be not hardcoded
            } else {
              option.forEach(function(data) {
                serieOption[data.linkedTo] = data.rawValue[0];
              })
            }*/
          } else {
            serieOption[option.linkedTo] = option.rawValue[0];
          }
        }

      });
      tempOption.push(serieOption);
    };

    if (tempOption.length > 0) {
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
    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
  }

  //////////////////////////////////////////////////////////////////////////////

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
    chartPreview.data.deleteSeries(index);
  });

  assignDataPanel.on('AssignDataChanged', function() {

    const data = dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData());

    setSeriesMapping(assignDataPanel.getAllOptions());
    chartPreview.data.csv({
      csv: data
    }, null, true);

    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
    //dataTable.highlightSelectedFields(input);
  });

  assignDataPanel.on('RedrawGrid', function(clearGridFirst) {
    redrawGrid(clearGridFirst);
  });

  assignDataPanel.on('ChangeData', function(allOptions) {
    //Series map all of the "linkedTo" options

    setSeriesMapping(allOptions);
  });
/*
  templates.on('Select', function(template) {
    chartPreview.loadTemplate(template);
  });

  templates.on('LoadDataSet', function(sample) {
    if (sample.type === 'csv') {
      if (highed.isArr(sample.dataset)) {
        chartPreview.data.csv(sample.dataset.join('\n'));
      } else {
        chartPreview.data.csv(sample.dataset);
      }

      chartPreview.options.set('subtitle-text', '');
      chartPreview.options.set('title-text', sample.title);
    }
  });*/
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
  chartPreview.on('LoadProject', function (projectData) {
    setTimeout(function () {
    assignDataPanel.setAssignDataFields(projectData, dataTable.getColumnLength(), true);
    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells, true);
    chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true));
    }, 1000);
    chartPreview.data.setAssignDataFields(assignDataPanel.getAssignDataFields());
  });

  dataTable.on('LoadGSheet', function(settings) {
    chartPreview.data.gsheet(settings);
  });
  
  dataTable.on('Change', function(headers, data) {
    chartPreview.data.setDataTableCSV(dataTable.toCSV(';', true));

    chartPreview.data.csv({
      csv: dataTable.toCSV(';', true, assignDataPanel.getAllMergedLabelAndData())
    }, null, true);

    setSeriesMapping(assignDataPanel.getAllOptions()); // Not the most efficient way to do this but errors if a user just assigns a column with no data in.
  });

  dataTable.on('ClearData', function() {
    chartPreview.data.clear();
  });

  chartPreview.on('ProviderGSheet', function(p) {
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
  });

  chartPreview.on('ProviderLiveData', function(p) {
    dataTable.loadLiveDataPanel(p);
  });

  //chartPreview.on('ChartRecreated', hideError);

  //////////////////////////////////////////////////////////////////////////////
/*
  highed.dom.ap(
    toolbar.left,
    highed.dom.style(highed.dom.cr('span'), {
      'margin-left': '2px',
      width: '200px',
      height: '60px',
      float: 'left',
      display: 'inline-block',
      'background-position': 'left middle',
      'background-size': 'auto 100%',
      'background-repeat': 'no-repeat',
      'background-image':
        'url("data:image/svg+xml;utf8,' +
        encodeURIComponent(highed.resources.logo) +
        '")'
    })
  );*/


  ////////////////////////////////////////////////// UNCOMMENT TO SHOW CHART!!!! ///////////////////////////////////////////
 
/*
  highed.dom.ap(
    splitter.bottom,
    highed.dom.ap(
      chartFrame,
      chartContainer,
      highed.dom.ap(errorBar, errorBarHeadline, errorBarBody)
    )
  );

  highed.dom.on([resWidth, resHeight], 'change', function() {
    sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
  });
*/
  // Create the features
 // createFeatures();
 // createToolbar();

 // resize();
  /**
   * Resize the chart preview based on a given width
   */

  function resizeChart(newWidth) {
    highed.dom.style(chartFrame, {
      /*left: newWidth + 'px',*/
      width: '28%',
      height: '38%'
    });
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    setTimeout(function() { chartPreview.resize(); }, 200);
  }

  chartPreview.on('AttrChange', function(option) {
    if (option.id === 'chart.height' || option.id === 'chart.width') {
      resQuickSel.selectByIndex(0);
      // setToActualSize();
    }
  });
  
  chartPreview.on('SetResizeData', function () {
    //setToActualSize();
  });


  return {
    on: events.on,
    destroy: destroy,
    addImportTab: addImportTab,
    hideImportModal: hideImportModal,
    chart: chartPreview,
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
    changeAssignDataTemplate: changeAssignDataTemplate//,
    //toolbar: toolbar
  };
};
