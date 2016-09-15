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
 *      > options {string|array} - the options to include
 *      > plugins {string|array} - the plugins to enable
 */
highed.SimpleEditor = function (parent, attributes) {
    var properties = highed.merge({
            importer: {}
        }, attributes),

        hsplitter = highed.HSplitter(parent),

        vsplitterRight = highed.VSplitter(hsplitter.right),
        preview = highed.ChartPreview(vsplitterRight.top, properties.chart),
        importer = highed.DataImporter(vsplitterRight.bottom, properties.importer),

        vsplitterLeft = highed.VSplitter(hsplitter.left),
        customizer = highed.ChartCustomizer(vsplitterLeft.top),
        bottomToolbar = highed.Toolbar(vsplitterLeft.bottom)
    ;

    ///////////////////////////////////////////////////////////////////////////

    /** Force a resize of the editor 
     *  @memberof highed.SimpleEditor
     */
    function resize() {

    }

    ///////////////////////////////////////////////////////////////////////////

    customizer.on('PropertyChange', chartPreview.options.set);
    importer.on('ImportCSV', chartPreview.data.csv);
    importer.on('ImportJSON', chartPreview.data.json);
    importer.on('ImportChartSettings', chartPreview.data.settings);

    ///////////////////////////////////////////////////////////////////////////

    //Public interface
    return {
        resize: resize
    };
};