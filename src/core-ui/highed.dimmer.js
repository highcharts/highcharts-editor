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

    /** Show a dimmer backdrop 
     *
     *  Used to catch input when showing modals, context menues etc.
     *
     *  @example
     *  highed.showDimmer(function () {
     *       alert('You clicked the dimmer!');
     *  });
     *
     *  @param {function} fn - the function to call when the dimmer is clicked
     *  @param {bool} autohide - set to true to hide the dimmer when it's clicked
     *  @param {bool} transparent - set to true for the dimmer to be transparent
     *  @param {number} zIndex - the z index *offset* 
     *  @return {function} - A function that can be called to hide the dimmer
     */
    highed.showDimmer = function (fn, autohide, transparent, zIndex) {
        var dimmer = highed.dom.cr('div', 'highed-dimmer'),
            unbinder = false
        ;


        highed.dom.ap(document.body, dimmer);

        highed.dom.style(dimmer, {
            'opacity': 0.7,
            'pointer-events': 'auto',
            'z-index': 9999 + (zIndex || 0)
        });

        if (transparent) {
            highed.dom.style(dimmer, {
                'opacity': 0
            });
        }

        function hide () {
            highed.dom.style(dimmer, {
                'opacity': 0,
                'pointer-events': 'none'
            });

            if (highed.isFn(unbinder)) {
                unbinder();
                unbinder = false;
            }

            window.setTimeout(function () {
                if (dimmer.parentNode) {
                    dimmer.parentNode.removeChild(dimmer);                    
                }
            }, 300);
        }

        unbinder = highed.dom.on(dimmer, 'click', function (e) {
            
            if (highed.isFn(fn)) {
                fn();
            }
            
            if (autohide) {
                hide();
            }
        });

        return hide;
    };

})();
