/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

highed.plugins.export.install('beautify-js', {
    title: 'Beautified JavaScript',
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

    //Options can be fetched in the hooks using this.options.<name of option>.
    options: {
        node: {
            label: 'Node to append chart to',
            type: 'string',
            default: 'document.body'
        }
    },

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
            var json = chart.export.json(true),
                custom = chart.getCustomCode()
            ;

            if (json.chart && json.chart.renderTo) {
                delete json.chart.renderTo;
            }

            this.cm.setValue(([
                'var options = ', JSON.stringify(json, false, '    '), ';\n',
                custom ? custom + '\n' : '',
                'var chart = new Highcharts.' + chart.getConstructor() + '(',
                this.options.node,
                ', options',
                ');'
            ].join('')));
            this.cm.refresh();
            this.cm.focus();
        };

        this.update.call(this, chart);
    },
    //Called when showing the UI. Also called when the options change.
    show: function (chart) {
        this.update.call(this, chart);
    },
    //Called when triggering an export
    export: function (options, chart, fn) {
        fn(false, this.cm.getValue(), 'chart.js');
    }
});
