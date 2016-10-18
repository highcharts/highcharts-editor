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

(function () {
    var exportPlugins = {};

    highed.plugins.export = {
        /** Install an export plugin
         *  @namespace highed.plugins.export
         *  @param name {string} - the name of the plugin
         *  @param definition {object} - the plugin definition
         */
        install: function (name, definition) {
            if (highed.isNull(exportPlugins[name])) {
                exportPlugins[name] = highed.merge({
                    description: '',
                    options: {},
                    title: false,
                    downloadOutput: false
                }, definition);

                if (exportPlugins[name].dependencies) {
                    highed.include(exportPlugins[name].dependencies);
                }

            } else {
                highed.log(1, 'tried to register an export plugin which already exists:', name);
            }
        }
    };

    /** Export widget
     *  
     *  @example
     *  var exporter = highed.Exporter(document.body),
     *      preview = highed.ChartPreview(document.body)
     *  ;
     *
     *  exporter.init(preview.export.json(), preview.export.html(), preview.export.svg(), preview);
     *
     *  @constructor
     *
     *  @param parent {domnode} - the node to attach the widget to
     *  @param attributes {object} - the options
     *    > options {string} - things to include: `csv html json plugins`
     *    > plugins {string|array} - plugins to activate
     */
    highed.Exporter = function (parent, attributes) {
        var //splitter = highed.HSplitter(parent, {leftWidth: 50, noOverflow: true}),
            properties = highed.merge({
                options: 'svg html json plugins',
                plugins: 'beautify-js beautify-json'
            }, attributes),    

            tctrl = highed.TabControl(parent),
            htmlTab = tctrl.createTab({title: 'Export HTML'}),
            jsonTab = tctrl.createTab({title: 'Export JSON'}),
            svgTab = tctrl.createTab({title: 'Export SVG'}),
            pluginTab = tctrl.createTab({title: 'Plugins'}),

            pluginSplitter = highed.HSplitter(pluginTab.body, {leftWidth: 30}),
            pluginList = highed.List(pluginSplitter.left),

            exportJSON = highed.dom.cr('a', '', 'Download'),
            exportHTML = highed.dom.cr('a', '', 'Download'),
            exportSVG = highed.dom.cr('a', '', 'Download'),
            jsonValue = highed.dom.cr('textarea', 'highed-imp-pastearea'),
            htmlValue = highed.dom.cr('textarea', 'highed-imp-pastearea'),
            svgValue = highed.dom.cr('textarea', 'highed-imp-pastearea'),

            currentChartPreview = false,
            hasBuiltPlugins = false,
            hasBeenVisible = false,
            pluginData = {},
            activePlugins = {},
            activePlugin = false
        ;

        properties.options = highed.arrToObj(properties.options);
        properties.plugins = highed.arrToObj(properties.plugins);

        ///////////////////////////////////////////////////////////////////////////        

        //Hides unwanted stuff
        function updateOptions() {
            if (!properties.options.html) {
                htmlTab.hide();
            }
            if (!properties.options.json) {
                jsonTab.hide();
            }
            if (!properties.options.svg) {
                svgTab.hide();
            }
            if (!properties.options.plugins) {
                pluginTab.hide();
            }
            if (Object.keys(properties.plugins) === 0) {
                pluginTab.hide();
            }

            tctrl.selectFirst();
        }


        //Build plugin panel
        function buildPlugins() {
            if (hasBuiltPlugins) return;
            hasBuiltPlugins = true;

            Object.keys(exportPlugins).forEach(function (name) {
                var options = exportPlugins[name]
                ;

                pluginData[name] = {options: {}};

                if (!properties.plugins[name]) {
                    return false;
                }

                function buildBody() {                      
                    var container = highed.dom.cr('div'),
                        executeBtn = highed.dom.cr('button', 'highed-imp-button', options.exportTitle || 'Export'),
                        dynamicOptionsContainer = highed.dom.cr('table', 'highed-customizer-table'),
                        additionalUI = highed.dom.cr('div'),
                        dynamicOptions = pluginData[name].options
                    ;
                    
                   // pluginSplitter.right.innerHTML = '';            

                    Object.keys(options.options || {}).forEach(function (pname) {
                        dynamicOptions[pname] = options.options[pname].default;

                        highed.dom.ap(dynamicOptionsContainer,
                            highed.InspectorField(
                                options.options[pname].type, 
                                options.options[pname].default, 
                                {
                                    title: options.options[pname].label
                                }, 
                                function (nval) {
                                    dynamicOptions[pname] = nval;

                                    if (highed.isFn(options.show)) {
                                        options.show.apply(pluginData[name], [currentChartPreview]);
                                    }
                                }, true)
                        );
                    });

                    function doExport() {
                        if (highed.isFn(options.export) && currentChartPreview) {
                            options.export.apply(pluginData[name], [dynamicOptions, currentChartPreview, function (err, data, filename) {
                                if (err) return highed.snackBar('Export error: ' + err);

                                if (options.downloadOutput) {
                                    highed.download(filename, data);
                                }

                                highed.snackBar((options.title || name) + ' export complete');
                            }, additionalUI]);
                        }
                    }

                    highed.dom.on(executeBtn, 'click', doExport);

                    highed.dom.ap(pluginSplitter.right, container);

                    highed.dom.style(container, {display: 'none'});

                    highed.dom.ap(container,
                        highed.dom.cr('div', 'highed-customizer-table-heading', options.title || name),
                        highed.dom.cr('div', 'highed-imp-help', options.description),
                        Object.keys(options.options || {}).length ? dynamicOptionsContainer : false,
                        additionalUI,
                        options.export ? executeBtn : false
                    );              

                    if (highed.isFn(options.create)) {
                        options.create.apply(pluginData[name], [currentChartPreview, additionalUI]);
                    }

                    activePlugins[name] = {
                        export: doExport,
                        show: function () {
                            if (activePlugin) {
                                activePlugin.hide();
                            }
                            highed.dom.style(container, {display: ''});
                            options.show.apply(pluginData[name], [currentChartPreview]);
                            activePlugin = activePlugins[name];
                        },
                        hide: function () {
                            highed.dom.style(container, {display: 'none'});
                        }
                    };
                }

                buildBody();
                
                pluginList.addItem({
                    id: name,
                    title: options.title || name,
                    click: activePlugins[name].show
                });

            });            
        }

        /** Set the export boxes based on chart JSON data (chart.options)
         *  @memberof highed.Exporter
         *  @param chartData {object} - the chart JSON
         *  @param chartHTML {string} - chart HTML
         *  @param chartSVG {string} - chart svg
         *  @param chartPreview {object} - instance of highed.ChartPreview
         */
        function init(chartData, chartHTML, chartSVG, chartPreview) {
            var title = '_export';

            if (chartData.title && chartData.title.text) {
                title = chartData.title.text.replace(/\s/g, '_') + title;
            } else {
                title = 'untitled' + title;
            }

            jsonValue.value = JSON.stringify(chartData);
            exportJSON.href = 'data:application/octet-stream,' + jsonValue.value;
        
            htmlValue.value = chartHTML;
            exportHTML.href = 'data:application/octet-stream,' + encodeURIComponent(chartHTML);

            svgValue.value = chartSVG;
            exportSVG.href = 'data:application/octet-stream,' + encodeURIComponent(chartSVG);

            exportJSON.download = title + '.json';
            exportHTML.download = title + '.html';
            exportSVG.download = title + '.svg';

            currentChartPreview = chartPreview;

            buildPlugins();

            // Object.keys(activePlugins).forEach(function (name) {
            //     activePlugins[name].show();
            // });

            if (activePlugin) {
                activePlugin.show();
            }

            hasBeenVisible = true;
        }   

        /** Force a resize of the UI
         *  @memberof highed.Exporter
         *  @param w {number} - the new width
         *  @param h {number} - the new height 
         */
        function resize(w, h) {
            var bsize;

            //splitter.resize(w, h);
            tctrl.resize(w, h);
            bsize = tctrl.barSize();

            pluginSplitter.resize(w, h - bsize.h - 20);
            pluginList.resize(w, h - bsize.h);
        }

        function doSelectOnClick(thing) {
            highed.dom.on(thing, 'click', function () {
                thing.focus();
                thing.select();
            });
        }

        ///////////////////////////////////////////////////////////////////////////

        highed.dom.ap(htmlTab.body,
           // highed.dom.cr('div', 'highed-imp-headline', 'Export HTML'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
                htmlValue
            ),
            highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
                exportHTML
            )
        );

        highed.dom.ap(jsonTab.body,
           // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
                jsonValue
            ),
            highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
                exportJSON
            )
        );

        highed.dom.ap(svgTab.body,
           // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
            highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
                svgValue
            ),
            highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
                exportSVG
            )
        );

        resize();
        updateOptions();

        doSelectOnClick(jsonValue);
        doSelectOnClick(htmlValue);
        doSelectOnClick(svgValue);

        ///////////////////////////////////////////////////////////////////////////

        return {
            init: init,
            resize: resize,
            buildPluginUI: buildPlugins
        };
    };
})();
