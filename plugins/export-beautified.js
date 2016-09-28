/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.export.install('beatify-js', {
    title: 'Beatuified JavaScript',
    description: 'Exports well-formatted JavaScript',
    dependencies: [
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/theme/neo.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/javascript/javascript.min.js'
    
    ],        
    //Set this to true to trigger a download when doing the export.
    //Useful for cases where the export is completely clientside.
    downloadOutput: true,
    //Set the title of the export button - default is "Export".
    exportTitle: 'Download',   
    //Called when creating the plugin
    create: function (chart, node) {
        this.textarea = highed.dom.cr('textarea');
        highed.dom.ap(node, this.textarea);

        this.cm = CodeMirror.fromTextArea(this.textarea, {
            lineNumbers: true,
           // value: chart.export.html(),
            mode: 'javascript',
            readOnly: true,
            theme: 'neo'
        });

        this.update = function (chart) {
            var json = chart.export.json();

            if (json.chart && json.chart.renderTo) {
                delete json.chart.renderTo;
            }

            this.cm.setValue(([
                'var chart = new Highcharts(document.body, ',
                JSON.stringify(json, undefined, '    '),
                ');'
            ].join('')));
            this.cm.refresh();
            this.cm.focus();
        };

        this.update(chart);
    },                  
    //Called when showing the UI
    show: function (chart) {
        this.update(chart);
    },
    //Called when triggering an export
    export: function (options, chart, fn) {
        fn(false, this.cm.getValue(), 'chart.js');
    }
});