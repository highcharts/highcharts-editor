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
        install: function (name, definition) {
            if (highed.isNull(exportPlugins[name])) {
                exportPlugins[name] = highed.merge({
                    description: '',
                    options: {}
                }, definition);

                if (exportPlugins[name].dependencies) {
                    highed.include(exportPlugins[name].dependencies);
                }

            } else {
                highed.log(1, 'tried to register an export plugin which already exists:', name);
            }
        }
    };

    highed.plugins.export.install('Beautified HTML', {
        description: 'Exports well-formatted HTML',
        dependencies: [
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/theme/monokai.min.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/xml/xml.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/htmlmixed/htmlmixed.min.js',
            'https://cdn.rawgit.com/beautify-web/js-beautify/master/js/lib/beautify.js',
            'https://cdn.rawgit.com/beautify-web/js-beautify/master/js/lib/beautify-css.js',
            'https://cdn.rawgit.com/beautify-web/js-beautify/master/js/lib/beautify-html.js'        
        ],           
        create: function (chart, node) {
            this.textarea = highed.dom.cr('textarea');
            highed.dom.ap(node, this.textarea);

            this.cm = CodeMirror.fromTextArea(this.textarea, {
                lineNumbers: true,
               // value: chart.export.html(),
                mode: 'htmlmixed',
                readOnly: true,
                theme: 'monokai'
            });

            this.update = function (chart) {
                this.cm.setValue(js_beautify(chart.export.html(true)));
                this.cm.refresh();
                this.cm.focus();
            };

            this.update(chart);
        },                  
        show: function (chart) {
            this.update(chart);
        },
        export: function (options, chart, fn) {

        }
    });

    highed.Exporter = function (parent, attributes) {
        var //splitter = highed.HSplitter(parent, {leftWidth: 50, noOverflow: true}),
            properties = highed.merge({
                options: 'csv html json plugins',
                plugins: ['Beautified HTML']
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
            pluginData = {}
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
            if (!properties.options.html) {
                htmlTab.hide();
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

                pluginData[name] = {};

                if (!properties.plugins[name]) {
                    return false;
                }

                function buildBody() {                      
                    var executeBtn = highed.dom.cr('button', 'highed-imp-button highed-imp-button-right', 'Export'),
                        dynamicOptionsContainer = highed.dom.cr('table', 'highed-customizer-table'),
                        additionalUI = highed.dom.cr('div'),
                        dynamicOptions = {}
                    ;
                    
                    pluginSplitter.right.innerHTML = '';            

                    Object.keys(options.options || {}).forEach(function (name) {
                        dynamicOptions[name] = options.options[name].default;

                        highed.dom.ap(dynamicOptionsContainer,
                            highed.InspectorField(
                                options.options[name].type, 
                                options.options[name].default, 
                                {
                                    title: options.options[name].label
                                }, 
                                function (nval) {
                                    dynamicOptions[name] = nval;
                                }, true)
                        );
                    });

                    highed.dom.on(executeBtn, 'click', function () {
                        if (highed.isFn(options.export && currentChartPreview)) {
                            options.export.apply(pluginData[name], [dynamicOptions, currentChartPreview, function (err) {
                                if (err) return highed.snackBar('Export error: ' + err);
                                highed.snackBar(name + ' export complete');
                            }, additionalUI]);
                        }
                    });

                    highed.dom.ap(pluginSplitter.right,
                        highed.dom.cr('div', 'highed-customizer-table-heading', name),
                        highed.dom.cr('div', 'highed-imp-help', options.description),
                        Object.keys(options.options || {}).length ? dynamicOptionsContainer : false,
                        additionalUI,
                        options.export ? executeBtn : false
                    );              

                    if (highed.isFn(options.create)) {
                        options.create.apply(pluginData[name], [currentChartPreview, additionalUI]);
                    }
                }
                
                pluginList.addItem({
                    id: name,
                    title: name,
                    click: buildBody
                });

            });

            pluginList.selectFirst();
        }

        //Set the export boxes based on chart JSON data (chart.options)
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

            Object.keys(exportPlugins).forEach(function (name) {
                var options = exportPlugins[name];

                if (!properties.plugins[name]) {
                    return false;
                }
                if (highed.isFn(options.show)) {
                    options.show.apply(pluginData[name], [currentChartPreview]);
                }
            });
        }   

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