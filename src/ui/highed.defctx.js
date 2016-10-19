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

/** Create an instance of the default context menu
 *  This is shared accross the simple and full editor.
 *  @constructor
 *  @param chartPreview {highed.ChartPreview} - the chart preview for the menu
 */
highed.DefaultContextMenu = function (chartPreview) {
    var events = highed.events(),
        cmenu = highed.ContextMenu([
            {
                title: highed.getLocalizedStr('previewChart'),
                icon: 'area-chart',
                click: function () {
                    chartPreview.expand();
                }
            },
            '-',
            {
            title: highed.getLocalizedStr('newChart'),
            icon: 'file-o',
            click: function () {
                if (window.confirm(highed.getLocalizedStr('confirmNewChart'))) {
                    chartPreview.new();  
                    events.emit('NewChart');                
                }
            }
            },
            '-',
            {
                title: highed.getLocalizedStr('saveProject'),
                icon: 'floppy-o',
                click: function () {
                    highed.download('chart.json', JSON.stringify(chartPreview.export.json()));
                }
            },
            {
                title: highed.getLocalizedStr('loadProject'),
                icon: 'folder-open-o',
                click: function () {
                    highed.readLocalFile({
                        type: 'text',
                        accept: '.json',
                        success: function (file) {
                            try {
                                file = JSON.parse(file.data);
                            } catch (e) {
                                return highed.snackBar('Error loading JSON: ' + e);
                            }

                            chartPreview.data.json(file);
                        }
                    });
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('exportPNG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({});
                }
            },
            {
                title: highed.getLocalizedStr('exportJPEG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({type: 'image/jpeg'});
                }
            },
            {
                title: highed.getLocalizedStr('exportSVG'),
                icon: 'file-image-o',
                click: function () {
                    chartPreview.data.export({type: 'image/svg+xml'});
                }
            },
            {
                title: highed.getLocalizedStr('exportPDF'),
                icon: 'file-pdf-o',
                click: function () {
                    chartPreview.data.export({type: 'application/pdf'});
                }
            },
            '-',
            {
                title: highed.getLocalizedStr('help'),
                icon: 'question-circle'
            },
            {
                title: highed.getLocalizedStr('licenseInfo'),
                icon: 'key',
                click: function () {
                    highed.licenseInfo.show();
                }
            }
        ])
    ;

    return {
        on: events.on,
        show: cmenu.show
    };
};
