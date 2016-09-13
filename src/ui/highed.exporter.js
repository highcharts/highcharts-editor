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
    var exportPlugins = {
            Test: {
                description: 'A test plugin. Will export to JSON.',
                options: {
                    test: {
                        type: 'string',
                        label: 'Test Option'
                    }
                },
                export: function (options, chart, fn) {

                }
            }
        }
    ;

    highed.plugins.export = {
        install: function (name, definition) {
            if (highed.isNull(exportPlugins[name])) {
                exportPlugins[name] = highed.merge({
                    description: '',
                    options: {},
                    export: function (){}
                }, defintion);
            } else {
                highed.log(1, 'tried to register an export plugin which already exists:', name);
            }
        }
    };

    highed.Exporter = function (parent, attributes) {
        var //splitter = highed.HSplitter(parent, {leftWidth: 50, noOverflow: true}),
            properties = highed.merge({
                options: 'csv html json plugins',
                plugins: 'Test'
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

            currentChartPreview = false
        ;

        properties.options = highed.arrToObj(properties.options);
        properties.plugins = highed.arrToObj(properties.plugins);

        ///////////////////////////////////////////////////////////////////////////        

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

            tctrl.selectFirst();
        }

        //Build plugin panel
        function buildPlugins() {

            Object.keys(exportPlugins).forEach(function (name) {
                var options = exportPlugins[name];

                if (!properties.plugins[name]) {
                    return false;
                }

                function buildBody() {                      
                    var executeBtn = highed.dom.cr('button', 'highed-imp-button highed-imp-button-right', 'Export'),
                        dynamicOptionsContainer = highed.dom.cr('table', 'highed-customizer-table'),
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
                            options.export(dynamicOptions, currentChartPreview, function (err) {
                                if (err) return highed.snackBar('Export error: ' + err);
                                highed.snackBar(name + ' export complete');
                            });
                        }
                    });

                    highed.dom.ap(pluginSplitter.right,
                        highed.dom.cr('div', 'highed-customizer-table-heading', name),
                        highed.dom.cr('div', 'highed-imp-help', options.description),
                        Object.keys(options.options || {}).length ? dynamicOptionsContainer : false,
                        executeBtn
                    );                
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
        buildPlugins();

        doSelectOnClick(jsonValue);
        doSelectOnClick(htmlValue);
        doSelectOnClick(svgValue);

        ///////////////////////////////////////////////////////////////////////////

        return {
            init: init,
            resize: resize
        };
    };
})();