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
    var instanceCount = 0,
        installedPlugins = {},
        activePlugins = {},
        pluginEvents = highed.events()
    ;


    ///////////////////////////////////////////////////////////////////////////

    //We embed the plugin system here because we want to access it in the
    //editor, but there shouldn't be any access to the internals outside.

     function install(name, definition) {
        var properties = highed.merge({
                meta: {
                    version: 'unknown',
                    author: 'unknown',
                    homepage: 'unknown'
                },
                dependencies: [],
                options: {}
            }, definition)
        ;

        properties.dependencies.forEach(function (script) {
            var t = highed.dom.cr('script');
            t.src = script;
            highed.dom.ap(document.head, t);
        });

        if (!highed.isNull(installedPlugins[name])) {
            return highed.log(1, 'plugin -', name, 'is already installed');
        }

        installedPlugins[name] = properties;
    }

    function use(name, options) {
        var plugin = installedPlugins[name],
            filteredOptions = {}
        ;

        if (!highed.isNull(plugin)) {
            if (activePlugins[name]) {
                return highed.log(2, 'plugin -', name, 'is already active');
            }

            //Verify options
            Object.keys(plugin.options).forEach(function (key) {
                var option = plugin.options[key];
                if (highed.isBasic(option) || highed.isArr(option)) {
                    highed.log(2, 'plugin -', name, 'unexpected type definition for option', key, 'expected object');
                } else {

                    filteredOptions[key] = options[key] || plugin.options[key].default || '';

                    if (option.required && highed.isNull(options[key])) {
                        highed.log(1, 'plugin -', name, 'option', key, 'is required');
                    }
                }
            });

            activePlugins[name] = {
                definition: plugin,
                options: filteredOptions
            };

            if (highed.isFn(plugin.activate)) {
                activePlugins[name].definition.activate(filteredOptions);
            }    

            pluginEvents.emit('Use', activePlugins[name]);

        } else {
            highed.log(2, 'plugin -', name, 'is not installed');
        }
    }

    //Public interface
    highed.plugins = {
        install: install,
        use: use
    };

    ///////////////////////////////////////////////////////////////////////////

    /**
     * The main chart editor object 
     * @memberof! highed#
     * @exports highed.Editor
     * @param {object} parent - the node to attach the editor to
     * @param {object} attributes - the editor settings
     * @return {highed.Editor} - A new instance of an editor
     */
    highed.Editor = function (parent, attributes) {
        var events = highed.events(),
            customizedOptions = {},
            exports = {
                customizedOptions: customizedOptions,
                flatOptions: {},
                features: 'import export templates customize'
            },

            properties = highed.merge({
                defaultChartOptions: {},
                on: {},
                plugins: {}
            }, attributes),

            container = highed.dom.cr('div', 'highed-container'),

            mainToolbar = highed.Toolbar(container, {
                additionalCSS: ['highed-header']
            }),

            splitter = highed.HSplitter(container, {leftWidth: 60}),

            wizbar = highed.WizardBar(container, splitter.left),

            dataImp = highed.DataImporter(wizbar.addStep({title: 'Import'}).body),
        
            chartTemplateSelector = highed.ChartTemplateSelector(wizbar.addStep({title: 'Templates'}).body),
            chartContainer = highed.dom.cr('div', 'highed-box-size highed-chart-container'),

            chartCustomizer = highed.ChartCustomizer(wizbar.addStep({title: 'Customize'}).body, exports),

            dataStep = wizbar.addStep({title: 'Export', id: 'export'}),
            dataExp = highed.Exporter(dataStep.body),

            chart = new Highcharts.Chart({
                chart: {
                    type: 'bar',
                    renderTo: chartContainer                
                }
            }),

            cleanOptions = highed.merge({}, highed.merge(properties.defaultChartOptions, chart.options))
        ;

        ///////////////////////////////////////////////////////////////////////////

        
        /** 
         * Force a resize of the editor
         * @inner
         * @instance 
         */
        function resize() {
            var cs = highed.dom.size(container),
                ms = highed.dom.size(mainToolbar.container),
                wb = highed.dom.size(wizbar.container)
            ;

            //wizbar.resize(undefined, cs.h - ms.h - wb.h);
            chartCustomizer.resize(undefined, cs.h - ms.h - wb.h);
            chartTemplateSelector.resize(undefined, cs.h - ms.h - wb.h);
            splitter.resize(cs.w, cs.h - ms.h - wb.h);
            dataExp.resize(cs.w, cs.h - ms.h - wb.h);
            chart.reflow();
            dataImp.resize();
            events.emit('Resized');
        }

        /** 
         * Get embeddable chart
         * @inner
         * @instance 
         * @return {string} - String of HTML to reproduce the current chart.
         */
        function getEmbeddableHTML(placehold) {
            var id = 'highchart-' + (++instanceCount),
                jsIncludes = [
                    'https://code.highcharts.com/highcharts.js',
                    'http://code.highcharts.com/adapters/standalone-framework.js',
                    'https://code.highcharts.com/highcharts-more.js',
                    'https://code.highcharts.com/highcharts-3d.js',
                    'https://code.highcharts.com/modules/data.js'
                ],
                title = chart.options.titles ? chart.options.titles.text || 'untitled chart' : 'untitled chart'
            ;

            return '\n' + [
             //   '<iframe><html><head>',
                '<div class="mceNonEditable">',
                //Write JS includes
                jsIncludes.map(function (include) {
                    return '<script src="' + include + '"></script>';
                }).join(''),

                '<div id="', id, '">',
                getEmbeddableSVG(),
                '</div>',
               // '</head><body>',

                //Write instancer
                '<script type="text/javascript">',
                '(function(){',
                'new Highcharts.chart("', id, '", ', 
                    JSON.stringify(highed.merge(highed.merge({}, exports.customizedOptions), {chart: {renderTo: id}})), ');',
                '})();',
                '</script></div>'//</head><body><div id="' + id + '"></div></body></html></iframe>'

            ].join('') + '\n';
        }

        /**
         * Get SVG chart
         */
        function getEmbeddableSVG() {
            if (highed.isFn(chart.getSVG)) {
                return chart.getSVG();            
            } else {
                highed.log(1, 'tried to export to SVG, but exporter module is not loaded');
            }
        }

        /** 
         * Get chart JSON
         * @inner
         * @instance 
         * @return {string} - String of JSON to reproduce the current chart.
         */
        function getEmbeddableJSON() {
            return JSON.stringify(exports.customizedOptions);
        }

        function destroy() {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }

        ///////////////////////////////////////////////////////////////////////////

        //Attach to parent node
        parent = highed.dom.get(parent);
        if (parent) {
            highed.dom.ap(parent, 
                container                           
            );

            highed.dom.ap(splitter.right, 
                chartContainer
            );

            highed.dom.ap(mainToolbar.left,
                highed.dom.cr('div', 'highed-logo')
            );

            resize();
        } else {
            highed.log(1, 'no valid parent supplied to editor');
        }

        highed.dom.on(window, 'resize', resize);

        highed.dom.ap(mainToolbar.right,
            highed.dom.cr('span', 'highed-credits', 'Highcharts Editor Beta')
        );

        ///////////////////////////////////////////////////////////////////////////
        
        //Handle chart template selection
        chartTemplateSelector.on('Select', function (template) {
            var options = highed.merge(highed.merge({}, cleanOptions), customizedOptions);

            Object.keys(template.config).forEach(function (key) {
                highed.setAttr(options, key, template.config[key]);
                highed.setAttr(exports.customizedOptions, key, template.config[key]);
                exports.flatOptions[key] = template.config[key];
            });

            options.chart.renderTo = chartContainer;
            chart = new Highcharts.Chart(options);

            events.emit('ChartChange', options);

            resize();
        });

        //Handle property change
        chartCustomizer.on('PropertyChange', function (id, value) {
            highed.setAttr([chart.options, customizedOptions], id, value);        
            highed.setAttr(chart.options, 'plotOptions--series--animation', false);

            exports.flatOptions[id] = value;

            chart = new Highcharts.Chart(chart.options);
            
            events.emit('ChartChange', chart.options);

            resize();
        });

        dataImp.on('ImportCSV', function (data) {
            if (!chart || !chart.options) {
                chart = {options: {}};
            }

            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'plotOptions--series--animation', true);
            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'data--csv', data.csv);
            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'data--itemDelimiter', data.itemDelimiter);
            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'data--firstRowAsNames', data.firstRowAsNames);
            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'data--dateFormat', data.dateFormat);
            highed.setAttr([chart.options, cleanOptions, exports.customizedOptions], 'data--decimalPoint', data.decimalPoint);
            highed.setAttr([chart.options, cleanOptions], 'series', {});

            chartContainer.innerHTML = '';

            chart = new Highcharts.Chart(chart.options);
            
            events.emit('ChartChange', chart.options);

            resize();
        });

        dataImp.on('ImportJSON', function (data) {
            if (!chart || !chart.options) {
                chart = {options: {}};
            }
            

            highed.merge(exports.customizedOptions, data);
            highed.merge(chart.options, data);

            highed.setAttr(chart.options, 'chart--renderTo', chartContainer);
            
            chart = new Highcharts.Chart(chart.options);
            events.emit('ChartChange', chart.options);
            resize();
        });

        wizbar.on('Step', function (step, count, thing) {
            if (thing.id === 'export') {
                dataExp.init(exports.customizedOptions, getEmbeddableHTML());
            }
        });

        ///////////////////////////////////////////////////////////////////////////
            
        //Attach event listeners defined in the properties
        if (!highed.isBasic(properties.on)) {
            Object.keys(properties.on).forEach(function (event) {
                if (highed.isFn(properties.on[event])) {
                    events.on(event, properties.on[event]);
                } else {
                    highed.log(2, 'tried attaching a non-function to' + event);
                }
            });
        } else {
            highed.log(2, 'on object in editor properties is not a valid object');
        }

        //Activate plugins
        Object.keys(properties.plugins).forEach(function (name) {
            highed.plugins.use(name, properties.plugins[name] || {});
        });

        //Dispatch change events to the active plugins
        events.on('ChartChange', function (options) {
            Object.keys(activePlugins).forEach(function (key) {
                var plugin = activePlugins[key];
                if (highed.isFn(plugin.definition.chartchange)) {
                    plugin.definition.chartchange.apply(plugin.options, [{
                        json: exports.customizedOptions
                    }, plugin.options]);
                }
            });
        });

        ///////////////////////////////////////////////////////////////////////////

        //Public interface
     
        /** 
         * Attach an event listener
         * @instance
         * @inner
         * @param {string} event - the event to listen for
         * @param {function} callback - the callback to execute when the event is emitted
         * @param {} context (optional) - the value of the this reference in the callback
         *
         * @return a function that can be called to unbind the listener
         */
        exports.on = events.on;
        /* Force a resize of the editor */
        exports.resize = resize;
        /* Get embeddable javascript */
        exports.getEmbeddableHTML = getEmbeddableHTML;
        /* Get embeddable json */
        exports.getEmbeddableJSON = getEmbeddableJSON;
        /* Get embeddable SVG */
        exports.getEmbeddableSVG = getEmbeddableSVG;
        /* Destroy the editor */
        exports.destroy = destroy;
        
        return exports;
    };
})();