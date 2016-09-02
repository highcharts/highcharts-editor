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

    /* Font picker 
     * @fn - the function to call when things change
     * @style - the current style object
     *
     * Note that this must be attached to the document manually
     *
     * Creates a small font picking widget with:
     *      - bold
     *      - font family
     *      - font size
     *      - color
     * options.
     */
    highed.FontPicker = function (fn, style) {
        var container = highed.dom.cr('div', 'highed-font-picker'),
            fontFamily = highed.dom.cr('select', 'font-family'),
            fontSize = highed.dom.cr('select', 'font-size'),
            boldBtn = highed.PushButton(undefined, 'bold'),
            italicBtn = highed.PushButton(undefined, 'italic'),
            color = highed.dom.cr('span', 'font-color', '&nbsp;')

        ;

        if (highed.isStr(style)) {
            try {
                style = JSON.parse(style);
            } catch (e) {

            }
        }

        style = highed.merge({
            'fontFamily': '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
            'color': '#333',
            'fontSize': '18px',
            'fontWeight': 'normal',
            'fontStyle': 'normal'
        }, style);
        
        ///////////////////////////////////////////////////////////////////////

        function callback() {
            if (highed.isFn(fn)) {
                fn(style);
            }
        }

        function updateColor(ncol, supressCallback) {
            highed.dom.style(color, {
                background: ncol
            });

            style.color = ncol;
            if (!supressCallback) {
                callback();             
            }
        }

        ///////////////////////////////////////////////////////////////////////

        //Add fonts to font selector
        highed.dom.options(fontFamily, highed.meta.fonts);
        //Add font sizes
        highed.dom.options(fontSize, [8, 10, 12, 14, 16, 18, 20, 22, 25, 26, 28, 30, 32, 34]);

        //Set the current values
        boldBtn.set(style['fontWeight'] === 'bold');
        italicBtn.set(style['fontStyle'] === 'italic');
        updateColor(style.color, true);
        highed.dom.val(fontFamily, style['fontFamily']);
        highed.dom.val(fontSize, style['fontSize'].replace('px', ''));

        //Listen to font changes
        highed.dom.on(fontFamily, 'change', function () {
            if (fontFamily.selectedIndex >= 0) {
                style['fontFamily'] = fontFamily.options[fontFamily.selectedIndex].id;
                callback();
            }
        });

        //Listen to font size changes
        highed.dom.on(fontSize, 'change', function () {
            if (fontSize.selectedIndex >= 0) {
                style['fontSize'] = fontSize.options[fontSize.selectedIndex].id + 'px';
                callback();
            }
        });

        //Listen to bold changes
        boldBtn.on('Toggle', function (state) {
            style['fontWeight'] = state ? 'bold' : 'normal';
            callback();
        });

        //Listen to italic changes
        italicBtn.on('Toggle', function (state) {
            style['fontStyle'] = state ? 'italic' : 'normal';
            callback();
        });

        //Handle color picker
        highed.dom.on(color, 'click', function (e) {
            highed.pickColor(e.clientX, e.clientY, style.color, updateColor);
        });

        //Create DOM
        highed.dom.ap(container,
            fontFamily,
            fontSize,
            boldBtn.button,
            italicBtn.button,
            color
        );

        ///////////////////////////////////////////////////////////////////////
        
        return {
            container: container
        };
    };
})();