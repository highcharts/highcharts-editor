/*

    Copyright (c) 2016, Highsoft

    Licensed under the MIT license.

*/

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