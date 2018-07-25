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
    title = highed.dom.cr('div', 'highed-toolbox-body-title', props.title),
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents test'
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
      '<i class="fa fa-cloud-upload" aria-hidden="true"></i> Import Data');
    
    highed.dom.on(dataImportBtn, 'click', function() {
      dataTable.showImportModal();
    });


    function showHelp() {
      helpModal.show();
    }

    highed.dom.on(helpIcon, 'click', showHelp);
    highed.dom.ap(contents, highed.dom.ap(title, dataImportBtn, helpIcon),/*(props.showLiveStatus ? highed.dom.ap(title, liveDiv, helpIcon) :  highed.dom.ap(title, helpIcon)),*/ userContents);
    highed.dom.ap(body, contents);

    highed.dom.ap(userContents, dataTableContainer);
    dataTable.resize();
    
    highed.dom.ap(parent, highed.dom.ap(container,body));


    function expand() {
      //var bsize = highed.dom.size(bar);
      var newWidth = props.width;
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
      assignDataPanel.resize(newWidth, highed.dom.pos(chartFrame, true).y - highed.dom.pos(body, true).y)
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

    expand();

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
    assignDataPanel.show();
    resizeChart();
    //expand();
    
  }
  function hide() {
    highed.dom.style(container, {
      display: 'none'
    });
    assignDataPanel.hide();
  }

  function destroy() {}

  function addImportTab(tabOptions) {
    dataTable.addImportTab(tabOptions);
  }

  function hideImportModal() {
    dataTable.hideImportModal();
  }

  function showError(title, message) {
    highed.dom.style(errorBar, {
      opacity: 1,
      'pointer-events': 'auto'
    });

    errorBarHeadline.innerHTML = title;
    errorBarBody.innerHTML = message;
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

  assignDataPanel.on('AssignDataChanged', function() {
    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
    //dataTable.highlightSelectedFields(input);
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

  dataTable.on('InitLoaded', function() {

    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
    //dataTable.highlightSelectedFields(assignDataPanel.getOptions());
  });

  dataTable.on('AssignDataChanged', function(input, options) {
    if (input.isData || input.isLabel) {
      return chartPreview.data.csv({
        csv: dataTable.toCSV(';', true, options)
      });
    }

/*
    if (input.linkedTo) {
      var tempOption = {
        data: {
          seriesMapping: [{
          }]
        }
      };
      tempOption.data.seriesMapping[0][input.linkedTo] = options[0];
      console.log('data--seriesMapping--' + input.linkedTo, options[0]);
      chartPreview.options.set('data--seriesMapping--' + input.linkedTo, options[0]);
      //'data--seriesMapping--' + input.linkedTo
    }(/)
    /*
    return chartPreview.data.csv({
      csv: dataTable.toCSV(';', true)
    });*/
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
  chartPreview.on('LoadProject', function () {
    setTimeout(function () {
    //resQuickSel.selectByIndex(0);
    //setToActualSize();
    assignDataPanel.resetValues();

    assignDataPanel.getFieldsToHighlight(dataTable.highlightCells);
    //dataTable.highlightSelectedFields(assignDataPanel.getOptions());
    }, 2000);
  });

  dataTable.on('LoadGSheet', function(settings) {
    chartPreview.data.gsheet(settings);
  });

  chartPreview.on('RequestEdit', function(event, x, y) {
    // Expanded
    if (toolboxEntries.customize.body.offsetWidth) {
      customizer.focus(event, x, y);

      // Collapsed
    } else {
      var unbind = toolboxEntries.customize.on('Expanded', function() {
        customizer.focus(event, x, y);
        unbind();
      });
      toolboxEntries.customize.expand();
    }
  });

  dataTable.on('Change', function(headers, data) {
    return chartPreview.data.csv({
      csv: dataTable.toCSV(';', true, assignDataPanel.getMergedLabelAndData())
    });
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

  chartPreview.on('Error', function(e) {
    if (e.indexOf('Highcharts error') >= 0) {
      var i1 = e.indexOf('#'),
        i = e.substr(i1).indexOf(':'),
        id = parseInt(e.substr(i1 + 1, i), 10),
        item = highed.highchartsErrors[id],
        urlStart = e.indexOf('www.'),
        url = '';

      if (urlStart >= 0) {
        url =
          '<div class="highed-errorbar-more"><a href="https://' +
          e.substr(urlStart) +
          '" target="_blank">Click here for more information</a></div>';
      }

      return showError(
        (item.title || "There's a problem with your chart") + '!',
        (item.text || e) + url
      );
    }

    showError("There's a problem with your chart!", e);
  });

  //chartPreview.on('ChartRecreated', hideError);

  if (!highed.onPhone()) {
    //highed.dom.on(window, 'resize', resize);
  }

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
      height: '37%'
    });
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    setTimeout(chartPreview.resize, 200);
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

  resizeChart();

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
    dataTable: dataTable//,
    //toolbar: toolbar
  };
};
