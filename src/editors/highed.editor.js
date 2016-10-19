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
                allowResize: true
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

            cmenu = highed.DefaultContextMenu(chartPreview)

        ;

        cmenu.on('NewChart', function () {
            dataImpStep.activate();
        });

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

            if (!things.welcome) {
                welcomeStep.hide();
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

        // function onPhone() {
        //   var check = false;
        //   (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        //   return check;
        // };

        ///////////////////////////////////////////////////////////////////////////

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

            highed.dom.ap(mainToolbar.left,
                highed.dom.style(highed.dom.cr('div', 'highed-logo'), {
                        'background-image': 'url("data:image/svg+xml;utf8,' + 
                                  encodeURIComponent(highed.resources.logo) +
                        '")'
                    }
                )
            );

            //if (!onPhone()) {
                resize();                
            //}

            highed.dom.on(window, 'resize', resize);
        } else {
            highed.log(1, 'no valid parent supplied to editor');
        }

        highed.dom.style(welcomeStep.body, {padding: '0 20px'});

        highed.dom.ap(welcomeStep.body, 
            highed.dom.cr('h2', '', 'Welcome'),
            highed.dom.cr('div', '', 'This wizard will take you through the process of creating your very own chart.'),
            highed.dom.cr('br'),
            highed.dom.cr('div', '', '')
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
        properties.plugins = highed.arrToObj(properties.plugins);
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

        mainToolbar.addIcon({
            css: 'fa-gear',
            click: function(e) {
                cmenu.show(e.clientX, e.clientY);
            }
        });

        chartCustomizer.init(chartPreview.options.customized, chartPreview.options.chart);

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
