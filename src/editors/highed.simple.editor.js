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

/** Simple one-pane editor
 *  @constructor
 *  @param parent {domnode} - the node to attach to
 *  @param attributes {object} - the options for the editor
 *    > importer {object} - options passed to the importer widget
 *      > options {string|array<string>} - the options to include
 *      > plugins {string|array<sting>} - the plugins to enable
 *    > availableSettings {array<string>} - the settings to include
 */
highed.SimpleEditor = function (parent, attributes) {
    var properties = highed.merge({
            importer: {},
            availableSettings: [
                'title--text',
                'subtitle--text',
                'colors',
                'chart--backgroundColor'
            ]
        }, attributes),

        hsplitter = highed.HSplitter(parent, {leftWidth: 60}),

        vsplitterRight = highed.VSplitter(hsplitter.right),
        preview = highed.ChartPreview(vsplitterRight.top, properties.chart),
        importer = highed.DataImporter(vsplitterRight.bottom, properties.importer),        

        customizer = highed.ChartCustomizer(hsplitter.left, {
            noAdvanced: true,
            availableSettings: properties.availableSettings
        })
    ;

    ///////////////////////////////////////////////////////////////////////////

    /** Force a resize of the editor 
     *  @memberof highed.SimpleEditor
     */
    function resize() {
        var ps = highed.dom.size(parent);

        vsplitterRight.resize(ps.w, ps.h);

        hsplitter.resize(ps.w, ps.h);

        preview.resize(ps.w, ps.h);
        importer.resize(ps.w, ps.h);
        customizer.resize(ps.w, ps.h);
    }

    function attachToCustomizer() {
        customizer.init(preview.options.customized);
    }

    ///////////////////////////////////////////////////////////////////////////

    customizer.on('PropertyChange', preview.options.set);
    importer.on('ImportCSV', [preview.data.csv, attachToCustomizer]);
    importer.on('ImportJSON', [preview.data.json, attachToCustomizer]);
    importer.on('ImportChartSettings', [preview.data.settings, attachToCustomizer]);

    ///////////////////////////////////////////////////////////////////////////

    resize();
    highed.dom.on(window, 'resize', resize);

    //Public interface
    return {
        resize: resize
    };
};