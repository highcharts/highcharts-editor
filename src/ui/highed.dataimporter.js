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

(function() {
  var webImports = {};

  highed.plugins.import = {
    /** Install a data import plugin
     * @namespace highed.plugins.import
     * @param name {string} - the name of the plugin
     * @param defintion {object} - the plugin definition
     *   > description {string} - the plugin description
     *   > treatAs {string} - what to treat the import as: `json|csv`
     *   > fetchAs {string} - what the expect request return is
     *   > defaultURL {string} - the default URL
     *   > depdendencies {array<string>} - set of additional javascript/css to include
     *   > options {object} - additional user-supplied options
     *      > label {string} - the title of the option
     *      > type {string} - the type of the option
     *      > default {string} - the default value
     *   > filter {function} - function to call when executing the plugin
     *      >  url {anything} - request url
     *      >  options {object} - contains user-defined options
     *      >  callback {function} - function to call when the import is done
     */
    install: function(name, defintion) {
      if (highed.isNull(webImports[name])) {
        webImports[name] = highed.merge(
          {
            title: false,
            description: '',
            treatAs: 'csv',
            fetchAs: 'json',
            defaultURL: '',
            dependencies: [],
            options: {},
            filter: function() {}
          },
          defintion
        );

        if (webImports[name].dependencies) {
          webImports[name].dependencies.forEach(function(d) {
            highed.include(d);
          });
        }
      } else {
        highed.log(
          1,
          'tried to register an import plugin which already exists:',
          name
        );
      }
    }
  };

  /** Data importer widget
   *
   *  @example
   *  var dimp = highed.DataImporter(document.body);
   *  dimp.on('ImportCSV', function (data) {
   *      console.log('Importing csv:', data.csv);
   *  });
   *
   *  @constructor
   *
   *  @emits ImportChartSettings - when importing chart settings
   *  @emits ImportCSV - when importing CSV
   *  @emits ImportJSON - when importing JSON
   *  @param parent {domnode} - the node to attach the widget to
   *  @param attributes {object} - the settings
   *     > options {string} - the options to include: `csv json plugins samples`
   *     > plugins {string} - the plugins to activate (must have been installed first)
   */
  highed.DataImporter = function(parent, attributes) {
    var events = highed.events(),
      properties = highed.merge(
        {
          options: ['csv', 'plugins', 'samples'],
          plugins: ['CSV', 'JSON', 'Difi', 'Socrata', 'Google Spreadsheets']
        },
        attributes
      ),
      tabs = highed.TabControl(parent, false, true),
      csvTab = tabs.createTab({ title: 'CSV' }),
      jsonTab = tabs.createTab({ title: 'JSON' }),
      webTab = tabs.createTab({ title: 'Plugins' }),
      samplesTab = tabs.createTab({ title: 'Sample Data' }),
      csvPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
      csvImportBtn = highed.dom.cr(
        'button',
        'highed-imp-button',
        'Import Pasted Data'
      ),
      liveDataImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Import Live Data'),
      csvImportFileBtn = highed.dom.cr(
        'button',
        'highed-imp-button',
        'Upload & Import File'
      ),
      delimiter = highed.dom.cr('input', 'highed-imp-input'),
      dateFormat = highed.dom.cr('input', 'highed-imp-input'),
      decimalPoint = highed.dom.cr('input', 'highed-imp-input'),
      firstAsNames = highed.dom.cr('input', 'highed-imp-input'),
      jsonPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
      jsonImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Import'),
      jsonImportFileBtn = highed.dom.cr(
        'button',
        'highed-imp-button',
        'Upload & Import File'
      ),
      webSplitter = highed.HSplitter(webTab.body, { leftWidth: 30 }),
      webList = highed.List(webSplitter.left);

    jsonPasteArea.value = JSON.stringify({}, undefined, 2);

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.style(samplesTab.body, { overflow: 'hidden' });

    properties.options = highed.arrToObj(properties.options);
    properties.plugins = highed.arrToObj(properties.plugins);

    //Remove referenced un-installed plugins.
    Object.keys(properties.plugins).forEach(function(plugin) {
      if (highed.isNull(webImports[plugin])) {
        delete properties.plugins[plugin];
      }
    });

    function updateOptions() {
      if (!properties.options.csv) {
        csvTab.hide();
      }

      //Always disable json options..
      if (1 === 1 || !properties.options.json) {
        jsonTab.hide();
      }

      if (
        Object.keys(properties.plugins).length === 0 ||
        !properties.options.plugins
      ) {
        webTab.hide();
      }

      if (!properties.options.samples) {
        samplesTab.hide();
      }

      tabs.selectFirst();
    }

    function buildWebTab() {
      Object.keys(webImports).forEach(function(name) {
        if (!properties.plugins[name]) {
          return;
        }

        function buildBody() {
          var options = webImports[name],
            url = highed.dom.cr('input', 'highed-imp-input-stretch'),
            urlTitle = highed.dom.cr('div', '', 'URL'),
            importBtn = highed.dom.cr(
              'button',
              'highed-imp-button',
              'Import ' + name + ' from URL'
            ),
            dynamicOptionsContainer = highed.dom.cr(
              'table',
              'highed-customizer-table'
            ),
            dynamicOptions = {};

          url.value = options.defaultURL || '';

          Object.keys(options.options || {}).forEach(function(name) {
            dynamicOptions[name] = options.options[name].default;

            highed.dom.ap(
              dynamicOptionsContainer,
              highed.InspectorField(
                options.options[name].type,
                options.options[name].default,
                {
                  title: options.options[name].label
                },
                function(nval) {
                  dynamicOptions[name] = nval;
                },
                true
              )
            );
          });

          if (options.surpressURL) {
            highed.dom.style([url, urlTitle], {
              display: 'none'
            });
          }

          url.placeholder = 'Enter URL';

          highed.dom.on(importBtn, 'click', function() {
            highed.snackBar('Importing ' + name + ' data');

            if (highed.isFn(options.request)) {
              return options.request(url.value, dynamicOptions, function(
                err,
                chartProperties
              ) {
                if (err) return highed.snackBar('import error: ' + err);
                events.emit(
                  'ImportChartSettings',
                  chartProperties,
                  options.newFormat
                );
              });
            }

            highed.ajax({
              url: url.value,
              type: 'get',
              dataType: options.fetchAs || 'text',
              success: function(val) {
                options.filter(val, highed.merge({}, dynamicOptions), function(
                  error,
                  val
                ) {
                  if (error) return highed.snackBar('import error: ' + error);
                  if (options.treatAs === 'csv') {
                    csvTab.focus();
                    csvPasteArea.value = val;
                    emitCSVImport(val);
                  } else {
                    processJSONImport(val);
                  }
                });
              },
              error: function(err) {
                highed.snackBar('import error: ' + err);
              }
            });
          });

          webSplitter.right.innerHTML = '';

          highed.dom.ap(
            webSplitter.right,
            highed.dom.ap(
              highed.dom.cr('div', 'highed-plugin-details'),
              highed.dom.cr(
                'div',
                'highed-customizer-table-heading',
                options.title || name
              ),
              highed.dom.cr('div', 'highed-imp-help', options.description),
              urlTitle,
              url,
              Object.keys(options.options || {}).length
                ? dynamicOptionsContainer
                : false,
              highed.dom.cr('br'),
              importBtn
            )
          );
        }

        webList.addItem({
          id: name,
          title: webImports[name].title || name,
          click: buildBody
        });
      });

      webList.selectFirst();
    }

    function buildSampleTab() {
      samplesTab.innerHTML = '';

      highed.samples.each(function(sample) {
        var data = sample.dataset.join('\n'),
          loadBtn = highed.dom.cr(
            'button',
            'highed-box-size highed-imp-button',
            sample.title
          );

        highed.dom.style(loadBtn, { width: '99%' });

        highed.dom.on(loadBtn, 'click', function() {
          emitCSVImport(data);
          csvPasteArea.value = data;
          csvTab.focus();
        });

        highed.dom.ap(
          samplesTab.body,
          //highed.dom.cr('div', '', name),
          //highed.dom.cr('br'),
          loadBtn,
          highed.dom.cr('br')
        );
      });
    }

    function emitCSVImport(csv) {
      events.emit('ImportCSV', {
        itemDelimiter: delimiter.value,
        firstRowAsNames: firstAsNames.checked,
        dateFormat: dateFormat.value,
        csv: csv || csvPasteArea.value,
        decimalPoint: decimalPoint.value
      });
    }

    function loadCSVExternal(csv) {
      csvPasteArea.value = csv;
      emitCSVImport();
    }

    function processJSONImport(jsonString) {
      var json = jsonString;
      if (highed.isStr(json)) {
        try {
          json = JSON.parse(jsonString);
        } catch (e) {
          highed.snackBar('Error parsing json: ' + e);
          return false;
        }
      }
      events.emit('ImportJSON', json);
      highed.snackBar('imported json');
    }

    /** Force a resize of the widget
     *  @memberof highed.DataImporter
     *  @param w {number} - the new width
     *  @param h {number} - the new height
     */
    function resize(w, h) {
      var bsize,
        ps = highed.dom.size(parent);

      tabs.resize(w || ps.w, h || ps.h);
      bsize = tabs.barSize();

      webSplitter.resize(w || ps.w, (h || ps.h) - bsize.h - 20);
      webList.resize(w || ps.w, (h || ps.h) - bsize.h);
    }

    /** Show the importer
     *  @memberof highed.DataImporter
     */
    function show() {
      tabs.show();
    }

    /** Hide the importer
     *  @memberof highed.DataImporter
     */
    function hide() {
      tabs.hide();
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(
      csvTab.body,
      highed.dom.cr(
        'div',
        'highed-imp-help',
        'Paste CSV into the below box, or upload a file. Click Import to import your data.'
      ),
      csvPasteArea,

      // highed.dom.cr('span', 'highed-imp-label', 'Delimiter'),
      // delimiter,
      // highed.dom.cr('br'),

      // highed.dom.cr('span', 'highed-imp-label', 'Date Format'),
      // dateFormat,
      // highed.dom.cr('br'),

      // highed.dom.cr('span', 'highed-imp-label', 'Decimal Point Notation'),
      // decimalPoint,
      // highed.dom.cr('br'),

      // highed.dom.cr('span', 'highed-imp-label', 'First Row Is Series Names'),
      // firstAsNames,
      // highed.dom.cr('br'),

      csvImportBtn,
      csvImportFileBtn,
      liveDataImportBtn
    );

    highed.dom.ap(
      jsonTab.body,
      highed.dom.cr(
        'div',
        'highed-imp-help',
        'Paste JSON into the below box, or upload a file. Click Import to import your data. <br/><b>The JSON is the data passed to the chart constructor, and may contain any of the valid <a href="http://api.highcharts.com/highcharts/" target="_blank">options</a>.</b>'
      ),
      jsonPasteArea,
      jsonImportFileBtn,
      jsonImportBtn
    );

    highed.dom.on(csvImportBtn, 'click', function() {
      emitCSVImport();
    });

    highed.dom.on(liveDataImportBtn, 'click', function () {
      //console.log(liveDataInput);
      //console.log(liveDataInput.value);
      events.emit('ImportLiveData', {
      //  url: liveDataInput.value
      });
    });
    
    highed.dom.on(csvPasteArea, 'keyup', function(e) {
      if (e.keyCode === 13 || ((e.metaKey || e.ctrlKey) && e.key === 'z')) {
        emitCSVImport(csvPasteArea.value);
      }
    });

    highed.dom.on(csvImportFileBtn, 'click', function() {
      highed.readLocalFile({
        type: 'text',
        accept: '.csv',
        success: function(info) {
          csvPasteArea.value = info.data;
          highed.snackBar('File uploaded');
          emitCSVImport();
        }
      });
    });

    highed.dom.on(jsonImportBtn, 'click', function() {
      processJSONImport(jsonPasteArea.value);
    });

    highed.dom.on(jsonImportFileBtn, 'click', function() {
      highed.readLocalFile({
        type: 'text',
        accept: '.json',
        success: function(info) {
          jsonPasteArea.value = info.data;
          processJSONImport(info.data);
        }
      });
    });

    buildSampleTab();
    buildWebTab();
    updateOptions();

    delimiter.value = ',';
    //dateFormat.value = 'YYYY-mm-dd';
    firstAsNames.type = 'checkbox';
    decimalPoint.value = '.';
    firstAsNames.checked = true;

    //Should hide the web tab if running where cross-origin is an issue

    resize();

    ///////////////////////////////////////////////////////////////////////////

    return {
      on: events.on,
      loadCSV: loadCSVExternal,
      resize: resize,
      show: show,
      hide: hide
    };
  };
})();
