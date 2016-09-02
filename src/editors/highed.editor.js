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

            properties = highed.merge({
                defaultChartOptions: {},
                on: {},
                plugins: {},
                features: 'import export templates customize',
                includeSVGInHTMLEmbedding: true   
            }, attributes),

            container = highed.dom.cr('div', 'highed-container'),

            mainToolbar = highed.Toolbar(container, {
                additionalCSS: ['highed-header']
            }),

            splitter = highed.HSplitter(container, {leftWidth: 60}),

            wizbar = highed.WizardBar(container, splitter.left),

            dataImpStep = wizbar.addStep({title: 'Import'}),
            dataImp = highed.DataImporter(dataImpStep.body),
        
            templateStep = wizbar.addStep({title: 'Templates'}),
            chartTemplateSelector = highed.ChartTemplateSelector(templateStep.body),

            chartContainer = highed.dom.cr('div', 'highed-box-size highed-chart-container'),
            chartPreview = highed.ChartPreview(chartContainer, properties.defaultChartOptions),

            customizerStep = wizbar.addStep({title: 'Customize', id: 'customize'}),
            chartCustomizer = highed.ChartCustomizer(customizerStep.body),

            dataExpStep = wizbar.addStep({title: 'Export', id: 'export'}),
            dataExp = highed.Exporter(dataExpStep.body)
        ;

        ///////////////////////////////////////////////////////////////////////////

        //Hide features that are disabled
        function applyFeatures() {
            var things = highed.arrToObj(properties.features.split(' '));

            if (!things.export) {
                dataExpStep.hide();
            }

            if (!things.import) {
                dataImpStep.hide();
            }

            if (!things.templates) {
                templateStep.hide();
            }

            if (!things.customize) {
                customizerStep.hide();
            }
        }

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
            chartPreview.resize();
            dataImp.resize();
            events.emit('Resized');
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
            highed.dom.on(window, 'resize', resize);
        } else {
            highed.log(1, 'no valid parent supplied to editor');
        }

        ///////////////////////////////////////////////////////////////////////////
        
        chartTemplateSelector.on('Select', chartPreview.loadTemplate);
        chartCustomizer.on('PropertyChange', chartPreview.options.set);
        dataImp.on('ImportCSV', chartPreview.data.csv);
        dataImp.on('ImportJSON', chartPreview.data.json);

        ///////////////////////////////////////////////////////////////////////////

        wizbar.on('Step', function (step, count, thing) {
            if (thing.id === 'export') {
                dataExp.init(
                    chartPreview.export.json(), 
                    chartPreview.export.html(properties.includeSVGInHTMLEmbedding),
                    chartPreview.export.svg()
                );
            } else if (thing.id === 'customize') {
                chartCustomizer.init(chartPreview.options.flat);
            }
        });

        //Route preview events
        chartPreview.on('ChartChange', function (newData) { events.emit('ChartChange', newData);});
        chartPreview.on('ChartChangeLately', function (newData) { events.emit('ChartChangeLately', newData);});

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
        chartPreview.on('ChartChangeLately', function (options) {
            Object.keys(activePlugins).forEach(function (key) {
                var plugin = activePlugins[key];
                if (highed.isFn(plugin.definition.chartchange)) {
                    plugin.definition.chartchange.apply(plugin.options, [{
                        json: highed.merge({}, chartPreview.options.customized)
                    }, plugin.options]);
                }
            });
        });

        applyFeatures();

        ///////////////////////////////////////////////////////////////////////////

        //Public interface
        return {
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
            on: events.on,
            /* Force a resize of the editor */
            resize: resize,
            /* Get embeddable javascript */
            getEmbeddableHTML: chartPreview.export.html,
            /* Get embeddable json */
            getEmbeddableJSON: chartPreview.export.json,
            /* Get embeddable SVG */
            getEmbeddableSVG: chartPreview.export.svg,
            /* Destroy the editor */
            destroy: destroy,
            /* Toolbar */
            toolbar: mainToolbar            
        };
    };
})();