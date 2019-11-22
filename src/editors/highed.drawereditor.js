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

highed.DrawerEditor = function(parent, options, planCode, chartType) {
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
    errorBarHeadlineContainer = highed.dom.cr(
      'div',
      'highed-errorbar-headline'
    ),
    errorBarHeadline = highed.dom.cr(
      'div',
      'highed-errorbar-headline-text',
      'This is an error!'
    ),
    errorBarClose = highed.dom.cr(
      'div',
      'highed-errorbar-close',
      '<i class="fa fa-times"/>'
    ),
    errorBarBody = highed.dom.cr(
      'div',
      'highed-errorbar-body highed-scrollbar',
      'Oh noes! something is very wrong!'
    ),
    betaContainer = highed.dom.cr('div', 'highed-beta-container'),
    betaLabel = highed.dom.cr('div', chartType === 'Map' ? 'highed-beta-label' : '', chartType === 'Map' ? 'BETA' : ''),
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
          desktop: 66,
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
        icon: 'fa-chart-bar',
        widths: {
          desktop: 26,
          tablet: 24,
          phone: 100
        },
        title: 'Templates',
        nav: {
          icon: 'chart-bar',
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
      },
      customize: {
        icon: 'chart-pie',
        title: 'Customize Chart',
        nav: {
          icon: 'chart-pie',
          text: 'Customize',
          onClick: []
        },
        widths: {
          desktop: 27,
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
    workspaceBody = highed.dom.cr(
      'div',
      'highed-optionspanel-body highed-box-size highed-transition'
    ),
    workspaceButtons = highed.dom.cr(
      'div',
      'highed-optionspanel-buttons highed-optionspanel-cloud highed-box-size highed-transition'
    ),
    smallScreenWorkspaceButtons = highed.dom.cr(
      'div',
      'highed-xs-workspace-buttons highed-optionspanel-xs-cloud highed-box-size highed-transition'
    ),
    workspaceRes = highed.dom.cr(
      'div',
      'highed-optionspanel-buttons highed-optionspanel-res highed-box-size highed-transition'
    ),
    defaultPage,
    panel = highed.OptionsPanel(workspaceBody),
    toolbar = highed.Toolbar(splitter.top),
    // Chart preview
    highedChartContainer = highed.dom.cr('div', 'highed-chart-container highed-transition'),
    chartFrame = highed.dom.cr(
      'div',
      'highed-transition highed-box-size highed-chart-frame highed-scrollbar'
    ),
    showChartSmallScreen = highed.dom.cr(
      'div',
      'highed-transition highed-box-size highed-show-chart-xs',
      '<i class="fa fa-area-chart"/>'
    ),
    chartContainer = highed.dom.cr(
      'div',
      'highed-box-size highed-chart-frame-body'
    ),
    chartPreview = highed.ChartPreview(chartContainer, {
      defaultChartOptions: properties.defaultChartOptions
    }, planCode),
    suppressWarning = false,
    dataTableContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    payupModal = highed.SubscribeModal(),
    annotationModal = highed.AnnotationModal(),
    mapSelector = highed.MapSelector(chartPreview, planCode),
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
    customizePage = highed.CustomizePage(
      splitter.bottom,
      highed.merge(
        {
          importer: properties.importer
        },
        properties.customizer
      ),
      chartPreview,
      highedChartContainer,
      builtInOptions.customize,
      chartFrame,
      planCode,
      dataPage
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
    );
    createChartPage = highed.ChartWizard(
      splitter.bottom,
      properties.features,
      {
        title: 'Create Chart',
        widths: {
          desktop: 95
        }
      },
      chartPreview,
      chartType
    ),
    changePlanBtn = highed.dom.cr('button', 'highed-import-button', "Choose a plan"),
    createAccountLink = highed.dom.cr('a', '', 'Create one')
    // Res preview bar
    resPreviewBar = highed.dom.cr('div', 'highed-res-preview'),
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
        css: ' fas fa-save',
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
        css: 'fas fa-cloud-upload-alt',
        click: function() {
          highed.cloud.save(chartPreview);
        }
      },
      {
        title: highed.L('loadCloud'),
        css: 'fas fa-cloud-download-alt',
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

    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    titleHeader = highed.dom.cr('h3', '', 'Data'),
    iconContainer = highed.dom.cr('div', ''),
    titleContainer = highed.dom.ap(highed.dom.cr('div', 'highed-page-title'), titleHeader, helpIcon, iconContainer),
    helpModal = highed.HelpModal(builtInOptions.data.help || [])
    mapModal = highed.MapModal(highedChartContainer, dataPage);

  betaContainer.title = "Maps functionality is currently in Beta";

  highed.chartType = chartType;
  chartPreview.init();
  chartPreview.options.togglePlugins('map', chartType === 'Map');

  highed.dom.on(helpIcon, 'click', showHelp);
  highed.dom.ap(splitter.bottom, highed.dom.ap(betaContainer, betaLabel), highed.dom.ap(workspaceBody, workspaceRes, workspaceButtons));

  highed.dom.ap(splitter.bottom, titleContainer, smallScreenWorkspaceButtons);
  if (!properties.useHeader) {
    highed.dom.style(splitter.top.parentNode, {
      display: 'none'
    });
  }

  highed.dom.on(showChartSmallScreen, 'click', function() {
    if (highedChartContainer.classList.contains('active')) {
      highedChartContainer.classList.remove('active');
    } else {
      setTimeout(function(){
        chartPreview.resize();
      }, 200);
      highedChartContainer.classList += ' active';
    }
  });

  // Alias import to data
  builtInOptions.import = builtInOptions.data;
  panel.setDefault(dataPage);
  dataPage.show();

  chartPreview.on('EditMap', function(data) {
    mapModal.editMapValues(data)
  });

  chartPreview.on('SetChartAsMap', function() {
    chartType = 'Map';
    highed.chartType = chartType;
    createFeatures();
  });
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
        highed.dom.ap(workspaceRes, customizePage.getResolutionContainer());
      } else {
        // Create page
        defaultPage = highed.DefaultPage(splitter.bottom, option, chartPreview, highedChartContainer);
        defaultPage.init();
        option.nav.page = defaultPage;
      }


      var func = function(prev, newOption) {

        var stockToolsInclude = ['Customize', 'Templates', 'Themes'];

        if (stockToolsInclude.includes(newOption.text)) {
          chartPreview.toggleShowAnnotationIcon(true);
        } else {
          chartPreview.toggleShowAnnotationIcon(false);
        }

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


      if (id == 'customize') {
        option.nav.onClick = [func];
      } else {
        option.nav.onClick.push(func);
      }


      panel.addOption(option.nav, id);
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

  function showChartWizard() {

    createChartPage.init(dataPage, templatePage, customizePage, mapSelector, highedChartContainer);

    highed.dom.style([workspaceBody, showChartSmallScreen, smallScreenWorkspaceButtons], {
      opacity: 0,
      maxHeight:'0px'
    });
    panel.getPrev().hide();
    createChartPage.show();
    highed.dom.style([chartFrame, titleContainer], {
      opacity: '0',
      maxHeight: '0px'
    });

    if(highed.onPhone()) {
      highed.dom.style(titleContainer, {
        display: 'none'
      });
    }

    createChartPage.on('SimpleCreateChartDone', function(goToDataPage) {

      highed.dom.ap(splitter.bottom, highedChartContainer);
      createChartPage.hide();
      highed.dom.style([chartFrame, titleContainer], {
        opacity: '1',
        maxHeight: 'max-content'
      });
      highed.dom.style([workspaceBody, showChartSmallScreen, smallScreenWorkspaceButtons], {
        opacity: 1,
        maxHeight: 'max-content'
      });

      if(highed.onPhone()) {
        highed.dom.style(titleContainer, {
          display: 'block'
        });
      }

      if (goToDataPage) {
        dataPage.show();
        panel.setDefault(dataPage);
        dataPage.resize();
      } else {

        const customize = panel.getOptions().customize;

        if (customize) {
          customizePage.setTabBehaviour(true)
          customize.click();
        }
/*
        titleHeader.innerHTML = builtInOptions.customize.title;
        customizePage.show();
        panel.setDefault(customizePage);*/
      }
    });

    createChartPage.on('SimpleCreateChangeTitle', function(options) {
      chartPreview.options.set('title--text', options.title);
      chartPreview.options.set('subtitle--text', options.subtitle);
      setChartTitle(options.title);
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
    panel.getPrev().resize()
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

  function addToWorkspace(options) {

    const btn = highed.dom.cr('button', 'highed-import-button green action-btn', "Action <i class='fa fa-chevron-down'/>");
    const btn2 = highed.dom.cr('button', 'highed-import-button green action-btn', "Action <i class='fa fa-chevron-down'/>");
    
    highed.dom.on(btn, 'click', function() {
      highed.dom.style(workspaceButtons, {
        overflow: (workspaceButtons.style.overflow === '' || workspaceButtons.style.overflow === 'hidden' ? 'unset' : 'hidden')
      });
    });

    highed.dom.on(btn2, 'click', function() {
      highed.dom.style(smallScreenWorkspaceButtons, {
        overflow: (smallScreenWorkspaceButtons.style.overflow === '' || smallScreenWorkspaceButtons.style.overflow === 'hidden' ? 'unset' : 'hidden')
      });
    });

    highed.dom.ap(workspaceButtons, btn);
    highed.dom.ap(smallScreenWorkspaceButtons, btn2);

    options.forEach(function(option, index) {
      const btn = highed.dom.cr('button', 'highed-import-button green highed-sm-dropdown-button' + (!index ? ' highed-btn-dropdown-first' : ''), option.text);
      highed.dom.on(btn, 'click', option.onClick);

      const btn2 = highed.dom.cr('button', 'highed-import-button green highed-sm-dropdown-button' + (!index ? ' highed-btn-dropdown-first' : ''), option.text);
      highed.dom.on(btn2, 'click', option.onClick);

      highed.dom.ap(workspaceButtons, btn);
      highed.dom.ap(smallScreenWorkspaceButtons, btn2);
      
      
    });
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
  
  function showError(title, message, warning, code) {
    
    if (suppressWarning) return;
      
    highed.dom.style(errorBarClose, {
      display: 'inline-block'
    });

    if (warning) {
      if (!errorBar.classList.contains('highed-warningbar')) errorBar.classList += ' highed-warningbar';
    } else {
      errorBar.classList.remove('highed-warningbar');
    }
    
    highed.dom.style(errorBar, {
      opacity: 1,
      'pointer-events': 'auto',
    });

    errorBarHeadline.innerHTML = title;
    errorBarBody.innerHTML = message;

    if (code === 14) {
      dataPage.showDataTableError();
    }
  }

  function hideError() {
    highed.dom.style(errorBar, {
      opacity: 0,
      'pointer-events': 'none'
    });
    dataPage.hideDataTableError();
  }

  //////////////////////////////////////////////////////////////////////////////
  // Event attachments

  templatePage.on('AddDefaultSeries', function(extra) {
    dataPage.addSerie(null, extra);
  });

  templatePage.on('ChangeAssignDataType', function(type, extra) {
    dataPage.changeAssignDataType(type);

    if (extra) {
      chartPreview.options.addBlankSeries(0, null, extra);
    }
  });
  
  mapSelector.on('AddSerie', function(extra) {
    dataPage.addSerie(null, extra);
  })

  mapSelector.on('LoadDataSet', function(data) {
    dataPage.loadSampleData(data);
  });

  mapSelector.on('ChangeTitle', function(title) {
    setChartTitle(title);
  });

  mapSelector.on('ChangeAssignLinkedToValue', function(values){
    dataPage.updateLinkedToValues(values);
  })

  mapSelector.on('LoadMapData', function(data, code, name, csv, cb, isLatLongChart) {
    dataPage.loadMapData(data, code, name, csv, cb, isLatLongChart);
    chartPreview.updateMapCodes(data);
  });

  chartPreview.on('LoadMapData', function(data, code, name) {
    dataPage.loadMapData(data, code, name);
    chartPreview.updateMapCodes(data);
  });

  dataPage.on('GoToTemplatePage', function() {
    const templates = panel.getOptions().templates;
    if (templates) templates.click();
  });

  dataPage.on('SeriesChanged', function(index) {
    if (((options && !options.features) || (options && options.features && options.features.indexOf('templates') > -1)) && templatePage) {
      templatePage.selectSeriesTemplate(index, chartPreview.options.getTemplateSettings());
    }
  });

  chartPreview.on('LoadProject', function (projectData, aggregated) {
    dataPage.loadProject(projectData, aggregated);
    templatePage.selectSeriesTemplate(0, projectData);
  });

  chartPreview.on(['LoadMapProject'], function (projectData, aggregated) {
    dataPage.loadMapProject(projectData, aggregated);
    templatePage.selectSeriesTemplate(0, projectData);
  });

  templatePage.on('TemplateChanged', function(newTemplate, loadTemplateForEachSerie, cb) {
    dataPage.changeAssignDataTemplate(newTemplate, loadTemplateForEachSerie, cb);
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

  chartPreview.on('LoadProject', function () {
    setTimeout(function () {
 //   resQuickSel.selectByIndex(0);
    setToActualSize();
    }, 2000);
  });

  chartPreview.on('RequestEdit', function(event, x, y) {

    const customize = panel.getOptions().customize;
    if (!panel.getCurrentOption() || panel.getCurrentOption().text !== 'Customize') {
      if (customize) {
        customizePage.setTabBehaviour(false)
        customize.click();
      }
    }

    setTimeout(function() {
      customizePage.selectOption(event, x, y);
    }, 500);
  });


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
    if (e && e.code && highed.highchartsErrors[e.code]) {
      
      var item = highed.highchartsErrors[e.code],
          url = '';

      if (e.url >= 0) {
        url =
          '<div class="highed-errorbar-more"><a href="https://' +
          e.substr(e.url) +
          '" target="_blank">Click here for more information</a></div>';
      }

      return showError(
        (item.title || "There's a problem with your chart") + '!',
        (item.text) + url,
        e.warning,
        e.code
      );
    }

    showError("There's a problem with your chart!", e);
  });

  chartPreview.on('ChartRecreated', hideError);

  payupModal.on('SwitchToSubscriptionPage', function(){
    events.emit("SwitchToSubscriptionPage");
  });
  
  payupModal.on('SwitchToCreateAccountPage', function(){
    events.emit("SwitchToCreateAccountPage");
  });

  highed.dom.on(window, 'resize', resize);
  
  highed.dom.on(window, 'afterprint', function() {
    setTimeout(function() {
      const currentOption = (panel.getCurrentOption() ? panel.getCurrentOption().page : dataPage);
      setTimeout(currentOption.resize, 10);
      resize();
    }, 1100);
  })

  highed.dom.on(errorBarClose, 'click', function() {
    hideError();
    suppressWarning = true;
  });

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
    showChartSmallScreen,
    highed.dom.ap(errorBar, highed.dom.ap(errorBarHeadlineContainer, errorBarHeadline, errorBarClose), errorBarBody)
  );

  highed.dom.on([resWidth, resHeight], 'change', function() {
    sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
  });

  // Create the features
  createFeatures();
  createToolbar();
  //showChartWizard();

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

  chartPreview.on('AttrChange', function(option) {
    if (option.id === 'chart.height' || option.id === 'chart.width') {
     //resQuickSel.selectByIndex(0);
      // setToActualSize();
    }
  });
  
  chartPreview.on('SetResizeData', function () {
    setToActualSize();
  });

  customizePage.on('Payup', function() {
    payupModal.show();
  });

  mapSelector.on('Payup', function() {
    payupModal.show();
  });


  chartPreview.on('ShowAnnotationModal', function(type) {
    annotationModal.show(type);
  });

  annotationModal.on('UpdateAnnotation', function(config, type) {
    chartPreview.updateAnnotation(config, type);
  });


  annotationModal.on('ClosePopup', function() {
    chartPreview.closeAnnotationPopup();
  });


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
    getChartTitle: dataPage.getChartTitle,
    setChartTitle: setChartTitle,
    showChartWizard: showChartWizard,
    addToWorkspace: addToWorkspace,
    data: {
      on: function() {}, //dataTable.on,
      showLiveStatus: function() {}, //toolbox.showLiveStatus,
      hideLiveStatus: function() {} //toolbox.hideLiveStatus
    },
    //dataTable: dataTable,
    toolbar: toolbar
  };
};
