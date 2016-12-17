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

/** Basic chart preview
 *  This is just a facade to Highcharts.Chart mostly.
 *  It implements a sliding drawer type widget,
 *  where the initial state can be as part of the main DOM,
 *  and where the expanded state covers most of the screen (90%)
 *
 *  @constructor
 *
 *  @param parent {domnode} - the node to attach the preview to
 *  @param attributes {object} - the settings
 *    > defaultChartOptions {object} - the default chart options 
 */
highed.ChartPreview = function (parent, attributes) {
    var properties = highed.merge({
            defaultChartOptions: {
                title: {
                    text: 'My Chart'
                },
                subtitle: {
                    text: 'My Untitled Chart'
                },
                exporting: {
                 //   url: 'http://127.0.0.1:7801'
                }
            },
            expandTo: parent
        }, attributes),

        events = highed.events(),
        customizedOptions = highed.merge({}, properties.defaultChartOptions),
        aggregatedOptions = {},
        flatOptions = {},   
        templateOptions = {},
        chartOptions = {},
      
        throttleTimeout = false,
        chart = false,
        preExpandSize = false,
        toggleButton = highed.dom.cr('div', 'highed-icon highed-chart-preview-expand fa fa-external-link-square'),
        expanded = false,
        constr = 'Chart',
        wysiwyg = {
            'g.highcharts-legend': { tab: 'Legend', id: 'legend--enabled'},
            'text.highcharts-title': { tab: 'Titles', id: 'title--text'},
            'text.highcharts-subtitle': { tab: 'Titles', id: 'subtitle--text'},
            '.highcharts-yaxis-labels': { tab: 'Axes', id: 'yAxis-labels--format'},
            '.highcharts-xaxis-labels': { tab: 'Axes', id: 'xAxis-labels--format'},
            '.highcharts-xaxis .highcharts-axis-title': { tab: 'Axes', id: 'xAxis-title--text'},
            '.highcharts-yaxis .highcharts-axis-title': { tab: 'Titles', id: 'yAxis-title--text'},
            'rect.highcharts-background': { tab: 'Appearance', id: 'chart--backgroundColor'},
            '.highcharts-series': { tab: 'Data series', id: 'series'},
            'g.highcharts-tooltip': { tab: 'Tooltip', id: 'tooltip--enabled'}
        }
    ;

    ///////////////////////////////////////////////////////////////////////////

    function attachWYSIWYG() {
        Object.keys(wysiwyg).forEach(function (key) {            
            highed.dom.on(parent.querySelector(key), 'click', function (e) {
                events.emit('RequestEdit', wysiwyg[key], e.clientX, e.clientY);
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false; 
            });
        });
    }

    /* Get the chart if it's initied */
    function gc(fn) {
        if (highed.isFn(fn)) {
            if (chart !== false) {
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
        events.emit('ChartChange', aggregatedOptions);

        //Throttled event - we use this when doing server stuff in the handler
        //since e.g. using the color picker can result in quite a lot of updates
        //within a short amount of time
        window.clearTimeout(throttleTimeout);
        throttleTimeout = window.setTimeout(function () {
            events.emit('ChartChangeLately', aggregatedOptions);
        }, 200);
    }

    /* Init the chart */
    function init(options, pnode, noAnimation) {
        var i;

        //We want to work on a copy..
        options = options || aggregatedOptions;
        // options = highed.merge({}, options || aggregatedOptions);
        
        // if (aggregatedOptions && aggregatedOptions.series) {
        //     options = aggregatedOptions.series; 
        // }

        if (noAnimation) {
            highed.setAttr(options, 'plotOptions--series--animation', false);
        }

        if (typeof window.Highcharts === 'undefined') {
            highed.snackBar('Highcharts.JS must be included to use the editor');
            return;
        }

        try {
            chart = new Highcharts[constr](pnode || parent, options);   
            //This is super ugly.
           // customizedOptions.series = customizedOptions.series || [];
          //  customizedOptions.series = chart.options.series || [];
           // highed.merge(customizedOptions.series, chart.options.series);
            updateAggregated();    

            if (chart && chart.options) {
                highed.clearObj(chartOptions);
                highed.merge(chartOptions, chart.options);                       
            }

            attachWYSIWYG();

            resize();
            highed.dom.ap(pnode || parent, toggleButton);

            Highcharts.addEvent(chart, 'afterPrint', function () {
                events.emit('RequestResize');
                highed.dom.ap(pnode || parent, toggleButton);
            });
        } catch (ex) {
            var e = ex.toString();

            //So we know that the return here is likely to be an
            //url with the error code. so extract it.
            highed.log(1, 'error initializing chart:', e);

            i = e.indexOf('www.');
            
            if (i > 0) {
                highed.snackBar('There\'s a problem with your chart!', e.substr(i), function () {
                    window.open('http://' + e.substr(i));
                });
            } else {
                //Our assumption was wrong. The world is ending.
                highed.snackBar(e);            
            }
            chart = false;
        }       

        return chart;
    }

    /* Resize the preview */
    function resize() {
        gc(function (chart) {
            if (chart.reflow) {
                chart.reflow();                
            }
        });
    }

    function updateAggregated() {
       // customizedOptions.plotOptions = customizedOptions.plotOptions || {};
       // customizedOptions.plotOptions.series = customizedOptions.plotOptions.series || [];
      //  customizedOptions.series = customizedOptions.series || [];

        if (customizedOptions && !highed.isArr(customizedOptions.yAxis)) {
            customizedOptions.yAxis = [customizedOptions.yAxis || {}];
        }

        if (customizedOptions && !highed.isArr(customizedOptions.xAxis)) {
            customizedOptions.xAxis = [customizedOptions.xAxis || {}];
        }

        templateOptions = templateOptions || {};

        if (templateOptions.yAxis && !highed.isArr(templateOptions.yAxis)) {
            templateOptions.yAxis = [templateOptions.yAxis];
        }

        if (templateOptions.xAxis && !highed.isArr(templateOptions.xAxis)) {
            templateOptions.xAxis = [templateOptions.xAxis];
        }

        // if (templateOptions.series) {
        //     templateOptions.series = templateOptions.series.map(function (s) {
        //         delete s['data'];
        //         return s;
        //     });
        // }

        //Merge fest
        highed.clearObj(aggregatedOptions);
        highed.merge(aggregatedOptions, 
            highed.merge(highed.merge({}, templateOptions), 
            customizedOptions
        ));

        //This needs to be cleaned up
        if (aggregatedOptions.yAxis && templateOptions.yAxis) {
            aggregatedOptions.yAxis.forEach(function (obj, i) {
                if (i < templateOptions.yAxis.length) {
                    highed.merge(obj, templateOptions.yAxis[i]);
                }
            });            
        }

         if (aggregatedOptions.xAxis && templateOptions.xAxis) {
            aggregatedOptions.xAxis.forEach(function (obj, i) {
                if (i < templateOptions.xAxis.length) {
                    highed.merge(obj, templateOptions.xAxis[i]);
                }
            });            
        }

        //Temporary hack
        //aggregatedOptions.series = customizedOptions.series;\
        aggregatedOptions.series = [];
        if (customizedOptions.series) {
            customizedOptions.series.forEach(function (obj, i) {
                aggregatedOptions.series.push(highed.merge({}, obj));
            });
        }
        
        if (templateOptions.series) {
            aggregatedOptions.series = aggregatedOptions.series || [];

            templateOptions.series.forEach(function (obj, i) {
                if (i < aggregatedOptions.series.length) {
                    highed.merge(aggregatedOptions.series[i], obj);
                } else {
                    aggregatedOptions.series.push(highed.merge({}, obj));
                }
            });
        }

        if (aggregatedOptions.yAxis && !highed.isArr(aggregatedOptions.yAxis)) {
            aggregatedOptions.yAxis = [aggregatedOptions.yAxis];
        }

        if (aggregatedOptions.xAxis && !highed.isArr(aggregatedOptions.xAxis)) {
            aggregatedOptions.xAxis = [aggregatedOptions.xAxis];
        }
    }

    /* Load a template from the meta
     * @template - the template object
     */
    function loadTemplate(template) {
        if (!template || !template.config) {
            return highed.log(1, 'chart preview: templates must be an object {config: {...}}');
        }

        constr = template.constr || 'Chart';

        highed.clearObj(templateOptions);

       // highed.setAttr(customizedOptions, 'series', []);

        gc(function (chart) {

            Object.keys(template.config).forEach(function (key) {
                var isArr = key.indexOf('['),
                    aIndex = 0,
                    p,
                    full = key
                ;

                if (isArr >= 0) {
                    aIndex = parseInt(key.substr(isArr + 1, key.indexOf(']') - isArr - 1), 10);  
                    key = key.replace('[' + aIndex + ']', '');
                    p = key.substr(0, key.indexOf('-'));
                    templateOptions[p] = templateOptions[p] || [];                     
                }

                highed.setAttr(templateOptions, key, template.config[full], aIndex);
                flatOptions[key] = template.config[full];
            });

            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        });
    }

    function loadSeries() {
        if (!gc(function (chart) {
            if (chart.options && chart.options.series) {
                customizedOptions.series = chart.options.series;                    
            }
            return true;
        })) {
            customizedOptions.series = [];
        }
        updateAggregated();
    }

    /* Load CSV data
     * @data - the data to load
     */
    function loadCSVData(data) {
        if (!data || !data.csv) {
            return highed.log(1, 'chart load csv: data.csv is required');
        }

        gc(function (chart) {
            highed.setAttr(customizedOptions, 'series', []);
            highed.setAttr(aggregatedOptions, 'series', []);

            highed.setAttr(customizedOptions, 'plotOptions--series--animation', true);
            highed.setAttr(customizedOptions, 'data--csv', data.csv);
            highed.setAttr(customizedOptions, 'data--googleSpreadsheetKey', undefined);
            highed.setAttr(customizedOptions, 'data--itemDelimiter', data.itemDelimiter);
            highed.setAttr(customizedOptions, 'data--firstRowAsNames', data.firstRowAsNames);
            highed.setAttr(customizedOptions, 'data--dateFormat', data.dateFormat);
            highed.setAttr(customizedOptions, 'data--decimalPoint', data.decimalPoint);

            updateAggregated();

            init(aggregatedOptions);
            loadSeries();
            emitChange();
        });
    }

    /* Load project
    *  @param projectData - the data to load
    */
    function loadProjectData(projectData) {
        if (highed.isStr(projectData)) {
            try {
                return loadProjectData(JSON.parse(projectData));
            } catch (e) {
                highed.snackBar('Invalid project');
            }
        }

        if (projectData) {

            templateOptions = {};
            if (projectData.template) {
                templateOptions = projectData.template;
            }
            
            customizedOptions = {};
            if (projectData.options) {
                customizedOptions = projectData.options;
            }

            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        }
    }

    /* Export project as JSON
     */
    function exportProject() {
        return {
            template: templateOptions,
            options: customizedOptions
        };
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

                templateOptions = {};
                highed.clearObj(customizedOptions);
                highed.merge(customizedOptions, highed.merge({}, data));
                if (!highed.isNull(data.series)) {
                    customizedOptions.series = data.series;                    
                }
                updateAggregated();
                init(customizedOptions);
                loadSeries();
                emitChange();
            }
        });
    }

    function loadChartSettings(settings) {
        gc(function (chart) {

            Object.keys(settings || {}).forEach(function (key) {
                highed.setAttr(customizedOptions, key, settings[key]);
            });

            updateAggregated();
            init(aggregatedOptions);
            emitChange();
        });
    }

    function loadSeriesData(seriesArr) {
        if (!highed.isArr(seriesArr)) return;
        customizedOptions.series = customizedOptions.series || [];

        if (seriesArr.length < customizedOptions.series.length) {
            //Need to delete some series
            customizedOptions.series.splice(
                seriesArr.length, 
                customizedOptions.series.length - seriesArr.length
            );
        }

        seriesArr.forEach(function (s, i) {
            if (s.name) {
                set('series-name', s.name, i);
            }
            if (s.data) {
                set('series-data', s.data, i);
            }
        });
    }

    /* Set an attribute
     * @id - the path of the attribute
     * @value - the value to set
     * @index - used if the option is an array
     */
    function set(id, value, index) {
         if (id.indexOf('lang--') === 0 && customizedOptions.lang) {
            Highcharts.setOptions({
                lang: customizedOptions.lang
            });
        }

        gc(function (chart) {
            highed.setAttr(chart.options, id, value, index);        
            highed.setAttr(chart.options, 'plotOptions--series--animation', false, index);
        });

        //We want to be able to set the customized options even if the chart 
        //doesn't exist
        highed.setAttr(customizedOptions, id, value, index);        

        flatOptions[id] = value;

        updateAggregated();
        init(aggregatedOptions, false, true);
        emitChange();

       
    }

    /* Get embeddable JSON */
    function getEmbeddableJSON() {
        var r = highed.merge({}, aggregatedOptions);

        //This should be part of the series
        if (!highed.isNull(r.data)) {
            r.data = undefined;
            //delete r['data'];
        }

        //Temprorary hack - need to fix the merge function
        r.series = aggregatedOptions.series;

        return r;
    }

    /* Get embeddable SVG */
    function getEmbeddableSVG() {
        return gc(function (chart) {
            return highed.isFn(chart.getSVG) ? chart.getSVG() : '';
        });
    }

    /* Get embeddable JavaScript */
    function getEmbeddableJavaScript(id) {
        return gc(function (chart) {            
            var 
                cdnIncludes = {
                    "https://code.highcharts.com/stock/highstock.js": 1,   
                    "https://code.highcharts.com/adapters/standalone-framework.js": 1,  
                    "https://code.highcharts.com/highcharts-more.js": 1,   
                    "https://code.highcharts.com/highcharts-3d.js": 1, 
                    "https://code.highcharts.com/modules/data.js": 1,  
                    "https://code.highcharts.com/modules/exporting.js": 1,
                    "http://code.highcharts.com/modules/funnel.js": 1,
                    "http://code.highcharts.com/modules/solid-gauge.js": 1
                },
                title = chart.options.titles ? chart.options.titles.text || 'untitled chart' : 'untitled chart'
            ;

            id = id || '';

         

            /*
                This magic code will generate an injection script that will
                check if highcharts is included, and include it if not.
                Afterwards, it will create the chart, and insert it into the page.

                It's quite messy, could to client-side templating or something,
                but it works.
            */

            return '\n' + [  
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
                        'new Highcharts.' + constr + '("', id, '", ', 
                            JSON.stringify(getEmbeddableJSON()), ')',
                    ' : ',
                    'window.setTimeout(cl, 20);',
                '}',
                'cl();',
                '})();'

            ].join('') + '\n';
        });
    }

    /* Get embeddable HTML */
    function getEmbeddableHTML(placehold) {
        return gc(function (chart) {       
            var id = 'highcharts-' + highed.uuid();     
            return '\n' + [
                '<div id="', id, '">',
                placehold ? getEmbeddableSVG() : '',
                '</div>'
            ].join('') + '<script>' + getEmbeddableJavaScript(id) + '</script>';
        });
    }

    /* Expand the chart from its drawer */
    function expand() {
        gc(function (chart) {
            if (!expanded) {            
                highed.dom.style(properties.expandTo, {
                    width: '100%',
                    display: 'block'
                });

                preExpandSize = highed.dom.size(parent);
                init(chart.options, properties.expandTo);
                expanded = true;

                toggleButton.className = 'highed-icon highed-chart-preview-expand fa fa-times-circle';

            }
        });
    }

    /* Collapse the chart into its drawer */
    function collapse() {
        gc(function (chart) {
            if (preExpandSize && expanded) {

                highed.dom.style(properties.expandTo, {
                    width: '0px',
                    display: 'none'
                });

                toggleButton.className = 'highed-icon highed-chart-preview-expand fa fa-external-link-square';

                init(chart.options, parent);
                expanded = false;
            }
        });
    }

    function newChart() {
        highed.clearObj(templateOptions);
        highed.clearObj(customizedOptions);
        highed.clearObj(flatOptions);

        highed.merge(customizedOptions, properties.defaultChartOptions);

        updateAggregated();
        
        init(aggregatedOptions);
        
        emitChange();
        events.emit('New');
    }

    function exportChart(options) {
        gc(function (chart) {
            chart.exportChart(options, aggregatedOptions);
        });
    }

    function changeParent(newParent) {
        parent = newParent;
        init();
    }

    function getConstructor() {
        return constr;
    }

    ///////////////////////////////////////////////////////////////////////////

    //Init the initial chart
    updateAggregated();
    init();

    highed.dom.on(toggleButton, 'click', function () {
        return expanded ? collapse() : expand();
    });

    ///////////////////////////////////////////////////////////////////////////

    return {
        getConstructor: getConstructor,
        on: events.on,
        expand: expand,
        collapse: collapse,
        new: newChart,
        changeParent: changeParent,

        loadTemplate: loadTemplate,
        loadSeries: loadSeriesData,
        resize: resize,
        
        toProject: exportProject,
        loadProject: loadProjectData,

        options: {
            set: set,
            customized: aggregatedOptions,
            flat: flatOptions,
            chart: chartOptions
        },

        data: {
            csv: loadCSVData,
            json: loadJSONData,
            settings: loadChartSettings,
            export: exportChart
        },

        export: {
            html: getEmbeddableHTML,
            json: getEmbeddableJSON,
            svg: getEmbeddableSVG,
            js: getEmbeddableJavaScript
        }
    };
};
