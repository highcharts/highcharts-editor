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

highed.Exporter = function (parent) {
    var //splitter = highed.HSplitter(parent, {leftWidth: 50, noOverflow: true}),
        tctrl = highed.TabControl(parent),
        htmlTab = tctrl.createTab({title: 'Export HTML'})
        jsonTab = tctrl.createTab({title: 'Export JSON'}),
        svgTab = tctrl.createTab({title: 'Export SVG'}),

        exportJSON = highed.dom.cr('a', '', 'Download'),
        exportHTML = highed.dom.cr('a', '', 'Download'),
        exportSVG = highed.dom.cr('a', '', 'Download'),
        jsonValue = highed.dom.cr('textarea', 'highed-imp-pastearea'),
        htmlValue = highed.dom.cr('textarea', 'highed-imp-pastearea'),
        svgValue = highed.dom.cr('textarea', 'highed-imp-pastearea')

    ;

    ///////////////////////////////////////////////////////////////////////////
    

    //Set the export boxes based on chart JSON data (chart.options)
    function init(chartData, chartHTML, chartSVG) {
        var title = '_export';

        if (chartData.title && chartData.title.text) {
            title = chartData.title.text.replace(/\s/g, '_') + title;
        } else {
            title = 'untitled' + title;
        }

        jsonValue.value = JSON.stringify(chartData);
        exportJSON.href = 'data:application/octet-stream,' + jsonValue.value;
    
        htmlValue.value = chartHTML;
        exportHTML.href = 'data:application/octet-stream,' + encodeURIComponent(chartHTML);

        svgValue.value = chartSVG;
        exportSVG.href = 'data:application/octet-stream,' + encodeURIComponent(chartHTML);

        exportJSON.download = title + '.json';
        exportHTML.download = title + '.html';
        exportSVG.download = title + '.svg';
    }   

    function resize(w, h) {
        //splitter.resize(w, h);
        tctrl.resize();
    }

    function doSelectOnClick(thing) {
        highed.dom.on(thing, 'click', function () {
            thing.focus();
            thing.select();
        });
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(htmlTab.body,
       // highed.dom.cr('div', 'highed-imp-headline', 'Export HTML'),
        highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
            htmlValue
        ),
        highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
            exportHTML
        )
    );

    highed.dom.ap(jsonTab.body,
       // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
        highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
            jsonValue
        ),
        highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
            exportJSON
        )
    );

    highed.dom.ap(svgTab.body,
       // highed.dom.cr('div', 'highed-imp-headline', 'Export JSON'),
        highed.dom.ap(highed.dom.cr('div', 'highed-imp-spacer'),
            svgValue
        ),
        highed.dom.ap(highed.dom.cr('button', 'highed-imp-button'),
            exportSVG
        )
    );

    resize();

    doSelectOnClick(jsonValue);
    doSelectOnClick(htmlValue);
    doSelectOnClick(svgValue);

    ///////////////////////////////////////////////////////////////////////////

    return {
        init: init,
        resize: resize
    };
};