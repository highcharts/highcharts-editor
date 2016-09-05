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

/* Basic chart preview
 * This is just a facade to Highcharts.Chart mostly.
 * It implements a sliding drawer type widget,
 * where the initial state can be as part of the main DOM,
 * and where the expanded state covers most of the screen (90%)
 */
highed.ChartPreview = function (parent, attributes) {
    var events = highed.events(),
        customizedOptions = {},
        flatOptions = {},   
        properties = highed.merge({
            defaultChartOptions: {
                titles: {
                    text: 'Untitled Chart'
                }
            },
            expandTo: parent
        }, attributes),
        throttleTimeout = false,
        chart = false,
        preExpandSize = false,
        toggleButton = highed.dom.cr('div', 'highed-icon highed-chart-preview-expand fa fa-arrow-left'),
        expanded = false
    ;

    ///////////////////////////////////////////////////////////////////////////

    /* Get the chart if it's initied */
    function gc(fn) {
        if (highed.isFn(fn)) {
            if (chart && chart.options) {
                return fn(chart);
            } else {                
                return fn(init());
                //highed.log(1, 'chart is undefined: chart preview');
            }
        } 
        return false;
    }

    /* Emit change events */
    function emitChange() {
        events.emit('ChartChange', customizedOptions);

        //Throttled event - we use this when doing server stuff in the handler
        //since e.g. using the color picker can result in quite a lot of updates
        //within a short amount of time
        clearTimeout(throttleTimeout);
        throttleTimeout = setTimeout(function () {
            events.emit('ChartChangeLately', customizedOptions);
        }, 800);
    }

    /* Init the chart */
    function init(options, pnode, noAnimation) {
        //We want to work on a copy..
        options = highed.merge({}, options || properties.defaultChartOptions);
        highed.setAttr(options, 'chart--renderTo', pnode || parent);

        if (noAnimation) {
            highed.setAttr(options, 'plotOptions--series--animation', false);
        }

        try {
            chart = new Highcharts.Chart(options);            
        } catch (e) {
            highed.log(1, 'error initializing chart:', e);
            highed.snackBar('Error creating chart preview: ' + e);
        }
        resize();
        highed.dom.ap(pnode || parent, toggleButton);

        return chart;
    }

    /* Resize the preview */
    function resize() {
        gc(function (chart) {
            chart.reflow();
        });
    }

    /* Load a template from the meta
     * @template - the template object
     */
    function loadTemplate(template) {
        if (!template || !template.config) {
            return highed.log(1, 'chart preview: templates must be an object {config: {...}}')
        }

        gc(function (chart) {
            var options = highed.merge({}, customizedOptions);

            Object.keys(template.config).forEach(function (key) {
                highed.setAttr([options, customizedOptions], key, template.config[key]);
                flatOptions[key] = template.config[key];
            });

            init(options);
            events.emit('ChartChange', customizedOptions);
        });
    }

    /* Load CSV data
     * @data - the data to load
     */
    function loadCSVData(data) {
        if (!data || !data.csv) {
            return highed.log(1, 'chart load csv: data.csv is required');
        }

        gc(function (chart) {
            highed.setAttr([chart.options, customizedOptions], 'plotOptions--series--animation', true);
            highed.setAttr([chart.options, customizedOptions], 'data--csv', data.csv);
            highed.setAttr([chart.options, customizedOptions], 'data--itemDelimiter', data.itemDelimiter);
            highed.setAttr([chart.options, customizedOptions], 'data--firstRowAsNames', data.firstRowAsNames);
            highed.setAttr([chart.options, customizedOptions], 'data--dateFormat', data.dateFormat);
            highed.setAttr([chart.options, customizedOptions], 'data--decimalPoint', data.decimalPoint);
            highed.setAttr(chart.options, 'series', {});

            init(chart.options);
            emitChange();
        });
    }

    /* Load JSON data
     * Functionally, this only instances a new
     * chart with the supplied data as its options.
     * It accepts both a string and and object
     * @data - the data to load
     */
    function loadJSONData(data) {
        gc(function (chart) {
            if (highed.isStr(data)) {
                try {
                    loadJSONData(JSON.parse(data));
                } catch (e) {
                    highed.snackBar('invalid json: ' + e);
                }
            } else if (highed.isBasic(data)) {
                highed.snackBar('the data is not valid json');
            } else {
                customizedOptions = highed.merge({}, data);
                init(customizedOptions);
                emitChange();
            }
        });
    }

    /* Set an attribute
     * @id - the path of the attribute
     * @value - the value to set
     */
    function set(id, value) {
        gc(function (chart) {
            highed.setAttr([chart.options, customizedOptions], id, value);        
            highed.setAttr(chart.options, 'plotOptions--series--animation', false);

            flatOptions[id] = value;

            init(customizedOptions, undefined, true);
            emitChange();
        });
    }

    /* Get embeddable JSON */
    function getEmbeddableJSON() {
        return highed.merge({}, customizedOptions);
    }

    /* Get embeddable SVG */
    function getEmbeddableSVG() {
        return gc(function (chart) {
            return highed.isFn(chart.getSVG) ? chart.getSVG() : '';
        });
    }

    /* Get embeddable HTML */
    function getEmbeddableHTML(placehold) {
        return gc(function (chart) {            
            var id = 'highcharts-' + highed.uuid(),
                cdnIncludes = {
                    "https://code.highcharts.com/stock/highstock.js": 1,   
                    "https://code.highcharts.com/adapters/standalone-framework.js": 1,  
                    "https://code.highcharts.com/highcharts-more.js": 1,   
                    "https://code.highcharts.com/highcharts-3d.js": 1, 
                    "https://code.highcharts.com/modules/data.js": 1,  
                    "https://code.highcharts.com/modules/exporting.js": 1
                },
                title = chart.options.titles ? chart.options.titles.text || 'untitled chart' : 'untitled chart'
            ;

            highed.setAttr(customizedOptions, 'chart--renderTo', id);

            /*
                This magic code will generate an injection script that will
                check if highcharts is included, and include it if not.
                Afterwards, it will create the chart, and insert it into the page.

                It's quite messy, could to client-side templating or something,
                but it works.
            */

            return '\n' + [
                '<div id="', id, '">',
                placehold ? getEmbeddableSVG() : '',
                '</div>',

                '<script type="text/javascript">',
                
                '(function(){ ',
                'function include(script, next) {',
                    'var sc=document.createElement("script");',
                    'sc.src = script;',
                    'sc.type="text/javascript";',
                    'sc.onload=function() {',
                        'if (++next < incl.length) include(incl[next], next);',
                    '};',
                    'document.head.appendChild(sc);',
                '}',

                'var inc = {},incl=[]; document.querySelectorAll("script").forEach(function(t) {inc[t.src.substr(0, t.src.indexOf("?"))] = 1;});',
                'Object.keys(', JSON.stringify(cdnIncludes), ').forEach(function (k){',
                    'if (!inc[k]) {',
                        'incl.push(k)',
                    '}',
                '});',

                'if (incl.length > 0) { include(incl[0], 0); }',

                ' function cl() {',
                    'typeof window["Highcharts"] !== "undefined" && Highcharts.Data ? ',
                        'new Highcharts.chart("', id, '", ', 
                            JSON.stringify(customizedOptions), ')',
                    ' : ',
                    'setTimeout(cl, 20);',
                '}',
                'cl();',
                '})();',
                '</script>'

            ].join('') + '\n';
        });
    };

    /* Expand the chart from its drawer */
    function expand() {
        gc(function (chart) {
            if (!expanded) {            
                highed.dom.style(properties.expandTo, {
                    width: '100%'
                });

                preExpandSize = highed.dom.size(parent);
                init(chart.options, properties.expandTo);
                expanded = true;

                toggleButton.className = 'highed-icon highed-chart-preview-expand fa fa-arrow-right';

            }
        });
    }

    /* Collapse the chart into its drawer */
    function collapse() {
        gc(function (chart) {
            if (preExpandSize && expanded) {

                highed.dom.style(properties.expandTo, {
                    width: '0%'
                });

                toggleButton.className = 'highed-icon highed-chart-preview-expand fa fa-arrow-left';

                init(chart.options, parent);
                expanded = false;
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////////

    //Init the initial chart
    init();

    highed.dom.on(toggleButton, 'click', function () {
        return expanded ? collapse() : expand();
    });
    
    ///////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        expand: expand,
        collapse: collapse,

        loadTemplate: loadTemplate,
        resize: resize,
        
        options: {
            set: set,
            customized: customizedOptions,
            flat: flatOptions
        },

        data: {
            csv: loadCSVData,
            json: loadJSONData
        },

        export: {
            html: getEmbeddableHTML,
            json: getEmbeddableJSON,
            svg: getEmbeddableSVG
        }
    };
};