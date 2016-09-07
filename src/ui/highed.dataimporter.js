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

/* Data importer widget
 * @parent - the node to attach the widget to
 *
 * @returns an instance of DataImporter
 */
highed.DataImporter = function (parent) {
    var events = highed.events(),

        tabs = highed.TabControl(parent),
        csvTab = tabs.createTab({title: 'CSV Import'}),
        jsonTab = tabs.createTab({title: 'JSON Import'}),
        samplesTab = tabs.createTab({title: 'Sample Data'}),

        csvPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
        csvImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Import'),
        csvImportFileBtn = highed.dom.cr('button', 'highed-imp-button', 'Upload & Import File'),
        delimiter = highed.dom.cr('input', 'highed-imp-input'),
        dateFormat = highed.dom.cr('input', 'highed-imp-input'),
        decimalPoint = highed.dom.cr('input', 'highed-imp-input'),
        firstAsNames = highed.dom.cr('input', 'highed-imp-input'),

        jsonPasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
        jsonImportBtn = highed.dom.cr('button', 'highed-imp-button', 'Import'),
        jsonImportFileBtn = highed.dom.cr('button', 'highed-imp-button', 'Upload & Import File')
    ;

    jsonPasteArea.value = JSON.stringify({}, undefined, 2);

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.style(samplesTab.body, {overflow: 'hidden'});

    function buildSampleTab() {
        samplesTab.innerHTML = '';

        if (!highed.isNull(highed.meta.sampleData)) {
            Object.keys(highed.meta.sampleData).forEach(function (name) {
                var data = highed.meta.sampleData[name].join('\n'),

                    loadBtn = highed.dom.cr('button', 'highed-box-size highed-imp-button', name)
                ;

                highed.dom.style(loadBtn, {width: '99%'});

                highed.dom.on(loadBtn, 'click', function () {
                    events.emit('ImportCSV', {
                        itemDelimiter: delimiter.value,
                        firstRowAsNames: firstAsNames.checked,
                        dateFormat: dateFormat.value,
                        csv: data,
                        decimalPoint: decimalPoint.value
                    });
                    csvPasteArea.value = data;
                    csvTab.focus();
                });

                highed.dom.ap(samplesTab.body, 
                    //highed.dom.cr('div', '', name),
                    //highed.dom.cr('br'),
                    loadBtn, 
                    highed.dom.cr('br')
                );
            });
        }
    }

    function emitCSVImport() {
        events.emit('ImportCSV', {
            itemDelimiter: delimiter.value,
            firstRowAsNames: firstAsNames.checked,
            dateFormat: dateFormat.value,
            csv: csvPasteArea.value,
            decimalPoint: decimalPoint.value
        });
    }

    function processJSONImport(jsonString) {
        var json;
        try {
            json = JSON.parse(jsonString);
        } catch(e) {
            highed.snackBar('Error parsing json: ' + e);
            return false;
        }
        events.emit('ImportJSON', json);
        highed.snackBar('imported json');
    }
    
    function resize() {
        tabs.resize();
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(csvTab.body, 
        highed.dom.cr('div', 'highed-imp-help', 'Paste CSV into the below box, or upload a file. Click Import to import your data.'),
        csvPasteArea,

        highed.dom.cr('span', 'highed-imp-label', 'Delimiter'),
        delimiter,
        highed.dom.cr('br'),

        highed.dom.cr('span', 'highed-imp-label', 'Date Format'),
        dateFormat,
        highed.dom.cr('br'),

        highed.dom.cr('span', 'highed-imp-label', 'Decimal Point Notation'),
        decimalPoint,
        highed.dom.cr('br'),

        highed.dom.cr('span', 'highed-imp-label', 'First Row Is Series Names'),
        firstAsNames,
        highed.dom.cr('br'),
        
        csvImportFileBtn,
        csvImportBtn
    );

    highed.dom.ap(jsonTab.body, 
        highed.dom.cr('div', 'highed-imp-help', 'Paste JSON into the below box, or upload a file. Click Import to import your data.'),
        jsonPasteArea,
        jsonImportFileBtn,
        jsonImportBtn
    );

    highed.dom.on(csvImportBtn, 'click', emitCSVImport);

    highed.dom.on(csvImportFileBtn, 'click', function () {
        highed.readLocalFile({
            type: 'text',
            success: function (info) {
                csvPasteArea.value = info.data;
                highed.snackBar('File uploaded');
                emitCSVImport();
            }
        });
    });

    highed.dom.on(jsonImportBtn, 'click', function () {
        processJSONImport(jsonPasteArea.value);
    });

    highed.dom.on(jsonImportFileBtn, 'click', function () {
        highed.readLocalFile({
            type: 'text',
            success: function (info) {
                jsonPasteArea.value = info.data;
                processJSONImport(info.data);
            }
        });
    });

    buildSampleTab();

    delimiter.value = ',';
    dateFormat.value = 'YYYY-mm-dd';
    firstAsNames.type = 'checkbox';
    decimalPoint.value = '.';
    firstAsNames.checked = true;

    ///////////////////////////////////////////////////////////////////////////
    
    return {
        on: events.on,
        resize: resize
    };
};