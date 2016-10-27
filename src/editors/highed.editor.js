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

     /** Install an editor plugin
      *
      *  Note that plugins must be enabled when creating the editor
      *  for it to be active.
      *
      *  @namespace highed.plugins.editor
      *
      *  @param name       {string} - the name of the plugin
      *  @param definition {object} - the plugin definition
      *     > meta {object}
      *         > version {string}
      *         > author {string}
      *         > homepage {string}
      *     > dependencies {array<string>} - URLs of script dependencies
      *     > options {object}
      *         > <option_name> {object}
      *             > type {string} - the type of the option
      *             > label {string} - the label
      *             > default {anything} - the default value
      */
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

        properties.dependencies.forEach(highed.include);

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
    highed.plugins.editor = {    
        install: install,
        use: use
    };

    ///////////////////////////////////////////////////////////////////////////

    /**The main chart editor object 
     * @constructor
     *
     * @example
     * var editor = highed.Editor('my-div', {
     *   
     * });
     * 
     * @emits ChartChange - when the chart changes
     *   > {object} - new chart data
     * @emits ChartChangedLately - when the chart changes, on a throttle so events are not emitted more frequently than every 100ms
     *   > {object} - new chart data
     *
     * @param {domnode} parent - the node to attach the editor to
     * @param {object} attributes - the editor settings
     *   > defaultChartOptions {object} - the initial chart options
     *   > on {object} - event listeners: key is event name, value is a function
     *   > plugins {string|array} - the editor plugins to enable
     *   > features {string} - the features to enable: `import`, `export`, `templates`, `customize`, `welcome`. Separate by string.
     *   > includeSVGInHTMLEmbedding {bool} - if true (which is default) the exported HTML will contain both an SVG fallback and the JavaScript injection
     *   > importer {object} - options passed to the contained importer object (see highed.DataImporter)
     *   > exporter {object} - options passd to the contained export object (see highed.DataExporter)
     *   > availableSettings {array} - array containing a whitelist of editable properties. Default is "show all available"
     * @return {highed.Editor} - A new instance of an editor
     */
    highed.Editor = function (parent, attributes) {
        var events = highed.events(),

            properties = highed.merge({
                defaultChartOptions: {},
                on: {},
                plugins: {},
                features: 'import export templates customize welcome',
                includeSVGInHTMLEmbedding: true,
                importer: {},
                exporter: {},
                availableSettings: false   
            }, attributes),

            container = highed.dom.cr('div', 'highed-container'),
            expandContainer = highed.dom.cr('div', 'highed-expand-container'),

            mainToolbar = highed.Toolbar(container, {
                additionalCSS: ['highed-header']
            }),

            splitter = highed.HSplitter(container, { 
                leftWidth: 60, 
                rightClasses: 'highed-chart-preview-bar', 
                allowResize: false,
                leftMax: 800
            }),

            wizbar = highed.WizardBar(container, splitter.left),

            welcomeStep = wizbar.addStep({ title: highed.getLocalizedStr('stepStart') }),

            dataImpStep = wizbar.addStep({ title: highed.getLocalizedStr('stepImport') }),
            dataImp = highed.DataImporter(dataImpStep.body, properties.importer),
        
            templateStep = wizbar.addStep({ title: highed.getLocalizedStr('stepTemplates') }),
            chartTemplateSelector = highed.ChartTemplateSelector(templateStep.body),

            chartContainer = highed.dom.cr('div', 'highed-box-size highed-chart-container'),
            chartPreview = highed.ChartPreview(chartContainer, { defaultChartOptions: properties.defaultChartOptions, expandTo: expandContainer }),

            customizerStep = wizbar.addStep({ title: highed.getLocalizedStr('stepCustomize'), id: 'customize' }),
            chartCustomizer = highed.ChartCustomizer(customizerStep.body, {
                availableSettings: properties.availableSettings
            }),

            dataExpStep = wizbar.addStep({ title: highed.getLocalizedStr('stepExport'), id: 'export' }),
            dataExp = highed.Exporter(dataExpStep.body, properties.exporter),

            doneBtn = highed.dom.cr('div', 'highed-ok-button', highed.getLocalizedStr('doneCaption')),
            doneStep = wizbar.addStep({title: highed.getLocalizedStr('stepDone')}),

            chartIcon = highed.dom.cr('div', 'highed-chart-container-icon'),

            cmenu = highed.DefaultContextMenu(chartPreview)

        ;

        cmenu.on('NewChart', function () {
            dataImpStep.activate();
        });

        ///////////////////////////////////////////////////////////////////////////

        function updateToolbarIcon() {
            if (highed.onPhone()) {
                highed.dom.style(chartIcon, {
                    'background-image': 'url("data:image/svg+xml;utf8,' + 
                          encodeURIComponent(chartPreview.export.svg()) +
                    '")'
                });
            }
        }

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

            if (!things.welcome) {
                welcomeStep.hide();
            }

            if (!things.done) {
                doneStep.hide();
            }
        
            wizbar.selectFirst();
        }

        /** 
         * Force a resize of the editor
         * @memberof highed.Editor
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
            dataImp.resize(cs.w, cs.h - ms.h - wb.h);
            events.emit('Resized');

            highed.dom.style(chartContainer, {
                'max-height': (cs.h - ms.h - wb.h) + 'px'                
            });
        }

        function destroy() {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }


        ///////////////////////////////////////////////////////////////////////////

        highed.dom.on(doneBtn, 'click', function () {
            events.emit('Done');
        });

        //Attach to parent node
        parent = highed.dom.get(parent);
        if (parent) {
            highed.dom.ap(parent, 
                highed.dom.ap(container,
                    expandContainer
                )                           
            );

            highed.dom.ap(splitter.right, 
                chartContainer
            );

            highed.dom.style(splitter.right, {
            //    overflow: 'hidden'
            });

            doneStep.body.className += ' highed-done-pane';

            highed.dom.ap(doneStep.body, 
                highed.dom.cr('div', '', [
                    '<h2>All done? Great!</h2>',
                    'Click the button below to close the editor'
                ].join('<br/>')),
                doneBtn
            );

            highed.dom.ap(mainToolbar.left,
                highed.dom.style(highed.dom.cr('div', 'highed-logo'), {
                        'background-image': 'url("data:image/svg+xml;utf8,' + 
                                  encodeURIComponent(highed.resources.logo) +
                        '")'
                    }
                )
            );

                resize();                

            if (!highed.onPhone()) {
                highed.dom.on(window, 'resize', resize);
            } 
        } else {
            highed.log(1, 'no valid parent supplied to editor');
        }

        highed.dom.style(welcomeStep.body, {padding: '0 20px'});

        highed.dom.ap(welcomeStep.body, 
            highed.dom.cr('h2', '', 'Welcome'),
            highed.dom.cr('div', '', 'This wizard will take you through the process of creating your very own chart.'),
            highed.dom.cr('br'),
            highed.dom.cr('div', '', 'Follow the steps below to get started!')
        );

        ///////////////////////////////////////////////////////////////////////////
        
        chartTemplateSelector.on('Select', chartPreview.loadTemplate);
        chartCustomizer.on('PropertyChange', chartPreview.options.set);
        dataImp.on('ImportCSV', chartPreview.data.csv);
        dataImp.on('ImportJSON', chartPreview.data.json);
        dataImp.on('ImportChartSettings', chartPreview.data.settings);

        chartPreview.on('RequestEdit', function (event, x, y) {
            chartCustomizer.focus(event, x, y);
        });

        ///////////////////////////////////////////////////////////////////////////

        wizbar.on('Step', function (step, count, thing) {
            if (thing.id === 'export') {
                dataExp.init(
                    chartPreview.export.json(), 
                    chartPreview.export.html(properties.includeSVGInHTMLEmbedding),
                    chartPreview.export.svg(),
                    chartPreview
                );
                dataExp.buildPluginUI();
            } else if (thing.id === 'customize') {
                chartCustomizer.init(chartPreview.options.customized, chartPreview.options.chart);                
            }
        });

        //Route preview events
        chartPreview.on('ChartChange', function (newData) { 
            events.emit('ChartChange', newData);

        });
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
        properties.plugins = highed.arrToObj(properties.plugins);
        Object.keys(properties.plugins).forEach(function (name) {
            highed.plugins.use(name, properties.plugins[name] || {});
        });

        //Dispatch change events to the active plugins
        chartPreview.on('ChartChangeLately', function (options) {

            updateToolbarIcon();

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

        chartCustomizer.init(chartPreview.options.customized, chartPreview.options.chart);

        // if (highed.onPhone()) {
        //     chartContainer.className = 'highed-chart-container-icon';
        //     highed.dom.ap(mainToolbar.right, chartIcon);

        //     highed.dom.on(chartIcon, 'click', function (e) {
        //         chartPreview.expand();
        //         e.cancelBubble = true;
        //         e.preventDefault();
        //         e.stopPropagation();
        //         e.stopImmediatePropagation();
        //         return false;
        //     });
        // }

        mainToolbar.addIcon({
            css: 'fa-bar-chart',
            click: function () {
                chartPreview.expand();
            }
        });

        mainToolbar.addIcon({
            css: 'fa-bars',
            click: function(e) {
                cmenu.show(e.clientX, e.clientY);
            }
        });

        updateToolbarIcon();

        highed.ready(function () {
            window.scrollTo(0, 1);
        });

        ///////////////////////////////////////////////////////////////////////////

        //Public interface
        return {
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
            toolbar: mainToolbar,
            chart: chartPreview            
        };
    };
})();
