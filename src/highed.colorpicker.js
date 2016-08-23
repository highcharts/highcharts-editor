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
    var container = highed.dom.cr('div', 'highed-colorpicker'),
        canvas = highed.dom.cr('canvas', 'picker'),
        ctx = canvas.getContext('2d'),
        manualInput = highed.dom.cr('input', 'manual')      
    ;

    //Attach the container to the document when the document is ready
    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    /* Color picker 
     * @x - the x position to display the picker at
     * @y - the y position to display the picker at
     * @current - the current color
     * @fn - the function to call when the color changes
     */
    highed.pickColor = function (x, y, current, fn) {
        var windowSize = highed.dom.size(document.body),
            containerSize = highed.dom.size(container),
            pickerSize = highed.dom.size(canvas),
            binder = false,
            pbinder = false
        ;

        ///////////////////////////////////////////////////////////////////////
        
        /* Draws the color picker itself */
        function drawPicker() {
            //There's 14 hues per. color, 19 colors in total.
            var tx = Math.floor(pickerSize.w / 14),
                ty = Math.floor(pickerSize.h / 19),             
                col = -1
            ; 

            canvas.width = pickerSize.w;
            canvas.height = pickerSize.h;

            //To avoid picking null
            ctx.fillStyle = '#FFF';
            ctx.fillRect(0, 0, pickerSize.w, pickerSize.h);

            for (var y = 0; y < 19; y++) {
                for (var x = 0; x < 15; x++) {
                    ctx.fillStyle = highed.meta.colors[++col];//highed.meta.colors[x + y * tx];
                    ctx.fillRect(x * tx, y * ty, tx, ty);
                }
            }
        }

        /* Hide the picker */
        function hide() {
            highed.dom.style(container, {
                opacity: 0,
                'pointer-events': 'none'
            });
            binder();
            pbinder();
        }

        function rgbToHex(r, g, b){
            var res = '#' + ((r << 16) | (g << 8) | b).toString(16);
            if (res.length === 5) {
                return res.replace('#', '#00');
            } else if (res.length === 6) {
                return res.replace('#', '#0');
            }
            return res;
        }

        function pickColor(e) {
            var px = e.clientX,
                py = e.clientY,
                cp = highed.dom.pos(canvas),
                id = ctx.getImageData(px - cp.x - x, py - cp.y - y, 1, 1).data,
                col = rgbToHex(id[0] || 0, id[1], id[2])
            ;

            manualInput.value = col;

            if (highed.isFn(fn)) {
                fn(col);
            }
        }

        ///////////////////////////////////////////////////////////////////////

        //Make sure we're not off screen
        if (x > windowSize.w - containerSize.w) {
            x = windowSize.w - containerSize.w - 10;
        }

        if (y > windowSize.h - containerSize.h) {
            y = windowSize.h - containerSize.h - 10;
        }
        
        highed.dom.style(container, {
            left: x + 'px',
            top: y + 'px',
            opacity: 1,
            'pointer-events': 'all'
        });

        highed.showDimmer(hide, true, true, 5);

        binder = highed.dom.on(manualInput, 'keyup', function () {
            if (highed.isFn(fn)) {
                fn(manualInput.value);
            }
        });

        pbinder = highed.dom.on(canvas, 'mousedown', function (e) {
            var mover = highed.dom.on(canvas, 'mousemove', pickColor),
                cancel = highed.dom.on(document.body, 'mouseup', function () {
                    mover();
                    cancel();
                })
            ;

            pickColor(e);
        });

        manualInput.value = current;

        drawPicker();

        ///////////////////////////////////////////////////////////////////////

        return {

        };
    };

    highed.dom.ap(container,
        canvas,
        manualInput
    );

})();