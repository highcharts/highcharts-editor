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

highed.DrawerEditor = function(parent, options) {
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
    errorBar = highed.dom.cr(
      'div',
      'highed-errorbar highed-box-size highed-transition'
    ),
    errorBarHeadline = highed.dom.cr(
      'div',
      'highed-errorbar-headline',
      'This is an error!'
    ),
    errorBarBody = highed.dom.cr(
      'div',
      'highed-errorbar-body highed-scrollbar',
      'Oh noes! something is very wrong!'
    ),
    lastSetWidth = false,
    fixedSize = false,
    splitter = highed.VSplitter(parent, {
      topHeight: properties.useHeader ? '60px' : '0px',
      noOverflow: true
    }),    
    builtInOptions = {
      data: {
        icon: 'fa-table',
        title: 'Data',
        widths: {
          desktop: 65,
          tablet: 64,
          phone: 100
        },
        nav: {
          icon: 'table',
          text: 'Data',
          onClick: []
        },
        help: [
          {
            title: 'Manually Add/Edit Data',
            gif: 'dataImport.gif',
            description: [
              'Click a cell to edit its contents.<br/><br/>',
              'The cells can be navigated using the arrow keys.<br/><br/>',
              'Pressing Enter creates a new row, or navigates to the row directly below the current row.'
            ]
          },
          {
            title: 'Setting headings',
            gif: 'dataImport.gif',
            description: [
              'The headings are used as the series titles.<br/><br/>',
              'They can be edited by left clicking them.<br/><br/>',
              'Click the arrow symbol in the header to access column properties.'
            ]
          },
          {
            title: 'Importing Data',
            gif: 'import.gif',
            description: [
              'To import data, simply drag and drop CSV files onto the table, or paste CSV/Excel data into any cell.<br/><br/>',
              'For more advanced data import, click the IMPORT DATA button.'
            ]
          }
        ],
        showLiveStatus: true
      },
      templates: {
        icon: 'fa-bar-chart',
        widths: {
          desktop: 25,
          tablet: 24,
          phone: 100
        },
        title: 'Templates',
        nav: {
          icon: 'bar-chart',
          text: 'Templates',
          onClick: []
        },
        help: [
          {
            title: 'Templates',
            description: [
              'Templates are pre-defined bundles of configuration.<br/><br/>',
              'Start by choosing the template category in the list to the left,',
              'then pick a suitable template for your data and use case in the',
              'template list.'
            ]
          }
        ]
      },/*
      export: {
        icon: 'fa-download',
        title: 'Export',
        width: 600,
        help: [
          {
            title: 'Export Chart',
            description: [
              'The export pane lets you export your chart to HTML, SVG, JSON, or JavaScript.<br/><br/>'
            ]
          }
        ]
      },*/
      customize: {
        icon: 'fa-sliders',
        title: 'Customize Chart',
        nav: {
          icon: 'pie-chart',
          text: 'Customize',
          onClick: []
        },
        widths: {
          desktop: 25,
          tablet: 24,
          phone: 100
        },
        help: [
          {
            title: 'Customize',
            description: [
              'The customize pane lets you customize your chart.<br/><br/>',
              'The customizer has three different sections:<br/>',
              '<li>Simple: A simple customizer with the most used options</li>',
              '<li>Advanced: All options available in Highcharts/Highstock can be set here</li>',
              '<li>Custom code: Here, properties can be overridden programatically</li>'
            ]
          }
        ]
      },
    },
    panel = highed.OptionsPanel(splitter.bottom),
    toolbar = highed.Toolbar(splitter.top),
    //toolbox = highed.Toolbox(splitter.bottom),
    //assignDataPanel = highed.AssignDataPanel(splitter.bottom),
    // Data table
/*
    dataTable = highed.DataTable(
      dataTableContainer,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.dataGrid
      )
    ),*/
    // Chart preview
    highedChartContainer = highed.dom.cr('div', 'highed-chart-container highed-transition'),
    chartFrame = highed.dom.cr(
      'div',
      'highed-transition highed-box-size highed-chart-frame highed-scrollbar'
    ),
    chartContainer = highed.dom.cr(
      'div',
      'highed-box-size highed-chart-frame-body'
    ),
    chartPreview = highed.ChartPreview(chartContainer, {
      defaultChartOptions: properties.defaultChartOptions
    }),
    dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    customizePage = highed.CustomizePage(
      splitter.bottom,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.dataGrid
      ),
      chartPreview,
      highedChartContainer,
      builtInOptions.customize,
      chartFrame
    ),
    dataPage = highed.DataPage(  
      splitter.bottom,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.dataGrid
      ),
      chartPreview,
      highedChartContainer,
      builtInOptions.data
    ),
    templatePage = highed.TemplatePage(      
      splitter.bottom,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.dataGrid
      ),
      chartPreview,
      highedChartContainer,
      builtInOptions.templates
    ),

    // Res preview bar
    resPreviewBar = highed.dom.cr('div', 'highed-res-preview'),
    resQuickSelContainer = highed.dom.cr('div', 'highed-res-quicksel'),
    resQuickSel = highed.DropDown(resQuickSelContainer),
    resWidth = highed.dom.cr('input', 'highed-res-number'),
    resHeight = highed.dom.cr('input', 'highed-res-number'),
    // Exporter
    exporterContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    exporter = highed.Exporter(exporterContainer),
    // Templates
    templatesContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    templates = highed.ChartTemplateSelector(templatesContainer, chartPreview),
    // Customizer
    customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    customizer = highed.ChartCustomizer(
      customizerContainer,
      properties.customizer,
      chartPreview
    ),
    // Toolbar buttons
    toolbarButtons = [
      {
        title: highed.L('newChart'),
        css: 'fa-file',
        click: function() {
          if (window.confirm(highed.getLocalizedStr('confirmNewChart'))) {
            chartPreview.new();
          }
        }
      },
      {
        title: highed.L('saveProject'),
        css: 'fa-floppy-o',
        click: function() {
          var name;

          if (chartPreview.options.full.title) {
            name = chartPreview.options.full.title.text;
          }

          name = (name || 'chart').replace(/\s/g, '_');

          highed.download(name + '.json', chartPreview.toProjectStr());
        }
      },
      {
        title: highed.L('openProject'),
        css: 'fa-folder-open',
        click: function() {
          highed.readLocalFile({
            type: 'text',
            accept: '.json',
            success: function(file) {
              try {
                file = JSON.parse(file.data);
              } catch (e) {
                return highed.snackBar('Error loading JSON: ' + e);
              }

              chartPreview.loadProject(file);
            }
          });
        }
      },
      '-',
      {
        title: highed.L('saveCloud'),
        css: 'fa-cloud-upload',
        click: function() {
          highed.cloud.save(chartPreview);
        }
      },
      {
        title: highed.L('loadCloud'),
        css: 'fa-cloud-download',
        click: function() {
          highed.cloud.showUI(chartPreview);
        }
      },
      '-',
      {
        title: 'Help',
        css: 'fa-question-circle',
        click: function() {
          window.open(highed.option('helpURL'));
        }
      }
    ].concat(properties.toolbarIcons),
    // Custom toolbox options
    customOptions = {},
    // The toolbox options

    toolboxEntries,
    resolutions = {
      'Stretch to fit': [false, false],
      'iPhone X': [375, 812],
      'iPhone 8 Plus': [414, 736],
      'iPhone 8': [375, 667],
      'iPhone 7 Plus': [414, 736],
      'iPhone 7': [375, 667],
      'iPhone 6 Plus': [414, 736],
      'iPhone 6/6S': [375, 667],
      'iPhone 5': [320, 568],
      'iPad Pro': [1024, 1366],
      iPad: [768, 1024],
      'Nexus 6P': [411, 731],
      'Nexus 5X': [411, 731],
      'Google Pixel': [411, 731],
      'Google Pixel XL': [411, 731],
      'Google Pixel 2': [411, 731],
      'Google Pixel 2 XL': [411, 731],
      'Samsung Galaxy Note 5': [480, 853],
      'LG G5': [480, 853],
      'One Plus 3': [480, 853],
      'Samsung Galaxy S8': [360, 740],
      'Samsung Galaxy S8+': [360, 740],
      'Samsung Galaxy S7': [360, 640],
      'Samsung Galaxy S7 Edge': [360, 640]
    },
    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    titleHeader = highed.dom.cr('h3', '', 'Data'),
    iconContainer = highed.dom.cr('div', ''),
    titleContainer = highed.dom.ap(highed.dom.cr('div', 'highed-page-title'), titleHeader, helpIcon, iconContainer),
    helpModal = highed.HelpModal(builtInOptions.data.help || []);

  highed.dom.on(helpIcon, 'click', showHelp);


  highed.dom.ap(splitter.bottom, titleContainer);
  if (!properties.useHeader) {
    highed.dom.style(splitter.top.parentNode, {
      display: 'none'
    });
  }

  // Alias import to data
  builtInOptions.import = builtInOptions.data;
  panel.setDefault(dataPage);

  /**
   * Creates the features defined in property.features
   * Call this after changing properties.features to update the options.
   */
  function createFeatures() {
    var addedOptions = {};
    panel.clearOptions();

    properties.features = highed.isArr(properties.features)
      ? properties.features
      : properties.features.split(' ');
    
    function addOption(option, id) {

      if (!option || !option.icon || !option.nav) {
        return;
      }

      if (id === 'data') {
        option.nav.page = dataPage;
        dataPage.init();
        option.nav.onClick.push(
          function() {
            highed.dom.style([highedChartContainer, chartContainer, chartFrame], {
              width: '100%',
              height: '100%',
            });
          }
        );
      } else if (id === 'templates') {
        option.nav.page = templatePage;
        templatePage.init();
      } else if (id === 'customize') {
        option.nav.page = customizePage;
        customizePage.init();
      } else {
        // Create page
        const defaultPage = highed.DefaultPage(splitter.bottom, option, chartPreview, highedChartContainer);
        defaultPage.init();
        option.nav.page = defaultPage;
      }
      
      option.nav.onClick.push(
        function(prev, newOption) {
          prev.hide();
          newOption.page.show();
          panel.setDefault(newOption.page);
          titleHeader.innerHTML = newOption.text;
          helpModal = (option.help ? highed.HelpModal(option.help  || []) : null);
          
          highed.dom.style(helpIcon, {
            display: (helpModal ? 'inline' : 'none')
          });

          iconContainer.innerHTML = '';
          if (newOption.page.getIcons()) {
            highed.dom.ap(iconContainer, newOption.page.getIcons());
          }
          
          highed.dom.style(iconContainer, {
            display: (newOption.page.getIcons() ? 'inline' : 'none')
          });

        }
      );

      panel.addOption(option.nav);
      addedOptions[id] = id;

    }

    //toolbox.clear();
    resize();
    
    properties.features.forEach(function(feature) {
      addOption(
        builtInOptions[feature] || customOptions[feature] || false,
        feature
      );
    });
    toolboxEntries = addedOptions;
    // resizeChart(toolbox.width());
  }

  function showHelp() {
    helpModal.show();
  }

  /**
   * Create toolbar
   */
  function createToolbar() {
    toolbarButtons.forEach(function(b) {
      if (b === '-') {
        toolbar.addSeparator();
      } else {
        toolbar.addIcon(b);
      }
    });
  }

  /**
   * Resize the chart preview based on a given width
   */
  function resizeChart(newWidth) {
    var psize = highed.dom.size(splitter.bottom);

    lastSetWidth = newWidth;

    highed.dom.style(highedChartContainer, {
      /*left: newWidth + 'px',*/
      width: '28%',
      height: '37%'
    });

    if (fixedSize) {
      // Update size after the animation is done
      setTimeout(function() {
        sizeChart(fixedSize.w, fixedSize.h);
      }, 400);
      return;
    }
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    chartPreview.resize();
  }

  function sizeChart(w, h) {
    if ((!w || w.length === 0) && (!h || h.length === 0)) {
      fixedSize = false;
      resHeight.value = '';
      resWidth.value = '';
      resizeChart(lastSetWidth);
    } else {
      var s = highed.dom.size(highedChartContainer);

      // highed.dom.style(chartFrame, {
      //   paddingLeft: (s.w / 2) - (w / 2) + 'px',
      //   paddingTop: (s.h / 2) - (h / 2) + 'px'
      // });

      fixedSize = {
        w: w,
        h: h
      };

      w = w || s.w - 100;
      h = h || s.h - 100;
/*
      highed.dom.style(chartContainer, {
        width: w + 'px',
        height: h + 'px'
      });
*/
      chartPreview.resize();
    }
  }

  /**
   * Resize everything
   */
  function resize() {
    splitter.resize();
    //resizeChart(toolbox.width());
  }

  /**
   * Change the enabled features
   */
  function setEnabledFeatures(feats) {
    properties.features = feats;
    createFeatures();
  }

  /**
   * Add a new feature
   */
  function addFeature(name, feat) {
    customOptions[name] = feat;
    //addPage(feat);
    createFeatures();
  }

  function destroy() {}

  function setChartTitle(title) {
    dataPage.setChartTitle(title);
  }

  function addImportTab(tabOptions) {
    dataPage.addImportTab(tabOptions);
  }

  function hideImportModal() {
    //dataTable.hideImportModal();
  }
  function showError(title, message) {
    highed.dom.style(errorBar, {
      opacity: 1,
      'pointer-events': 'auto'
    });

    errorBarHeadline.innerHTML = title;
    errorBarBody.innerHTML = message;
  }

  function hideError() {
    highed.dom.style(errorBar, {
      opacity: 0,
      'pointer-events': 'none'
    });
  }

  //////////////////////////////////////////////////////////////////////////////
  // Event attachments

  //toolbox.on('BeforeResize', resizeChart);
  /*

  customizer.on('PropertyChange', chartPreview.options.set);
  customizer.on('PropertySetChange', chartPreview.options.setAll);
*/
/*
  chartPreview.on('LoadProjectData', function(csv) {
    /*
    dataTable.loadCSV(
      {
        csv: csv
      },
      true
    );
  });*/

  templatePage.on('TemplateChanged', function(newTemplate){
    dataPage.changeAssignDataTemplate(newTemplate);
  })
  chartPreview.on('ChartChange', function(newData) {
    events.emit('ChartChangedLately', newData);
  });

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
  });
/*
  dataTable.on('LoadLiveData', function(settings){
    //chartPreview.data.live(settings);

    const liveDataSetting = {};

    liveDataSetting[settings.type] = settings.url;
    if (settings.interval && settings.interval > 0){
      liveDataSetting.enablePolling = true;
      liveDataSetting.dataRefreshRate = settings.interval
    }
    chartPreview.data.live(liveDataSetting);
  });*/
/*
  dataTable.on('UpdateLiveData', function(p){
    chartPreview.data.liveURL(p);
  });
*/
  chartPreview.on('LoadProject', function () {
    setTimeout(function () {
    resQuickSel.selectByIndex(0);
    setToActualSize();
    }, 2000);
  });
/*
  dataTable.on('LoadGSheet', function(settings) {
    //chartPreview.data.gsheet(settings);
  });
*/
  chartPreview.on('RequestEdit', function(event, x, y) {
    // Expanded ------------------------
    /*
    if (toolboxEntries.customize.body.offsetWidth) {
      customizer.focus(event, x, y);

      // Collapsed
    } else {
      var unbind = toolboxEntries.customize.on('Expanded', function() {
        customizer.focus(event, x, y);
        unbind();
      });
      toolboxEntries.customize.expand();
    }*/
  });
/*
  dataTable.on('Change', function(headers, data) {
    
    return chartPreview.data.csv({
      csv: dataTable.toCSV(';', true)
    });
  });*/
/*
  dataTable.on('ClearData', function() {
    chartPreview.data.clear();
  });*/

  chartPreview.on('ProviderGSheet', function(p) {
    /*
    dataTable.initGSheet(
      p.id || p.googleSpreadsheetKey,
      p.worksheet || p.googleSpreadsheetWorksheet,
      p.startRow,
      p.endRow,
      p.startColumn,
      p.endColumn,
      true,
      p.dataRefreshRate
    );*/
  });

  chartPreview.on('ProviderLiveData', function(p) {
    //dataTable.loadLiveDataPanel(p);
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

  chartPreview.on('ChartRecreated', hideError);

  highed.dom.on(window, 'resize', resize);
  

  //////////////////////////////////////////////////////////////////////////////

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
  );
  
  highed.dom.ap(
    splitter.bottom,
    highed.dom.ap(
      highedChartContainer,
      highed.dom.ap(chartFrame, chartContainer)
    ),
    highed.dom.ap(errorBar, errorBarHeadline, errorBarBody)
  );

  highed.dom.on([resWidth, resHeight], 'change', function() {
    sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
  });

  // Create the features
  createFeatures();
  createToolbar();

  resize();

  function setToActualSize() {
    resWidth.disabled = resHeight.disabled = 'disabled';
    chartPreview.getHighchartsInstance(function(chart) {
      var w, h;

      if (!chart || !chart.options || !chart.options.chart) {
        h = 400;
      } else {
        w = chart.options.chart.width;
        h = chart.options.chart.height || 400;
      }

      resWidth.value = w;
      resHeight.value = h;

      sizeChart(w, h);
    });
/*
    highed.dom.style(chartFrame, {
      'overflow-x': 'auto'
    });*/
  }

  resQuickSel.addItem({
    id: 'actual',
    title: 'Actual Size',
    select: function() {
      setToActualSize();
    }
  });

  chartPreview.on('AttrChange', function(option) {
    if (option.id === 'chart.height' || option.id === 'chart.width') {
      resQuickSel.selectByIndex(0);
      // setToActualSize();
    }
  });
  
  chartPreview.on('SetResizeData', function () {
    setToActualSize();
  });

  Object.keys(resolutions).forEach(function(devName) {
    resQuickSel.addItem({
      id: devName,
      title: devName,
      select: function() {
        resWidth.disabled = resHeight.disabled = undefined;

        resWidth.value = resolutions[devName][0];
        resHeight.value = resolutions[devName][1];

        sizeChart(resolutions[devName][0], resolutions[devName][1]);

        highed.dom.style(highedChartContainer, {
          'overflow-x': ''
        });
      }
    });
  });

  resQuickSel.selectByIndex(0);

  return {
    on: events.on,
    resize: resize,
    destroy: destroy,
    /* Get embeddable javascript */
    getEmbeddableHTML: chartPreview.export.html,
    /* Get embeddable json */
    getEmbeddableJSON: chartPreview.export.json,
    /* Get embeddable SVG */
    getEmbeddableSVG: chartPreview.export.svg,
    addImportTab: addImportTab,
    hideImportModal: hideImportModal,
    setEnabledFeatures: setEnabledFeatures,
    addFeature: addFeature,
    chart: chartPreview,
    toolbar: toolbar,
    setChartTitle: setChartTitle,
    data: {
      on: function() {}, //dataTable.on,
      showLiveStatus: function() {}, //toolbox.showLiveStatus,
      hideLiveStatus: function() {} //toolbox.hideLiveStatus
    },
    //dataTable: dataTable,
    toolbar: toolbar
  };
};
