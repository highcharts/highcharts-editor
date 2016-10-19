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

(function () {
    var container = highed.dom.cr('div', 'highed-tooltip highed-tooltip-fixed')
    ;

    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    function hide() {
        highed.dom.style(container, {
            opacity: 0,
            'pointer-events': 'none'
        });
    }

    highed.dom.on(container, 'mouseout', hide);
    highed.dom.on(container, 'click', hide);

    /** Show a tooltip
     *  @param x {number} - the x position of the tooltip
     *  @param y {number} - the y position of the tooltip
     *  @param tip {string} - the title
     *  @param blowup {boolean}  - blow the tooltip up
     */
    highed.Tooltip = function (x, y, tip, blowup) {
        var ds = highed.dom.size(document.body);

        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > ds.w - 200) x = ds.w - 200;        

        highed.dom.style(container, {
            opacity: 1,
            'pointer-events': 'auto',
            left: x - 20 + 'px',
            top: y - 20 + 'px',
            width: '200px'
        });

        if (blowup) {
            highed.dom.style(container, {
                opacity: 1,
                'pointer-events': 'auto',
                width: '90%',
                height: '90%',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            });
        }

        container.innerHTML = tip;
    };
})();
