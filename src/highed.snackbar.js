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
    var container = highed.dom.cr('div', 'highed-snackbar'),
        title = highed.dom.cr('span', 'snackbar-title', 'THIS IS A SNACKBAR'),
        action = highed.dom.cr('span', 'snackbar-action', 'ACTION'),
        timeout = false,
        callback = false
    ;

    highed.ready(function () {
        highed.dom.ap(document.body, 
            highed.dom.ap(container,
                title,
                action
            )
        );
    });

    highed.dom.on(container, 'mouseover', function () {
        clearTimeout(timeout);
    });

    highed.dom.on(container, 'mouseout', function () {
        hide();
    });

    ///////////////////////////////////////////////////////////////////////////
    
    function hide() {
        timeout = setTimeout(function () {
            highed.dom.style(container, {
                bottom: '-58px'
            });
        }, 4000);
    }

    ///////////////////////////////////////////////////////////////////////////

    /*  Show a snackbar 
     *  @stitle - the snackbar title
     *  @saction - the snackbar action text
     *  @fn - the function to call when clicking the action
     */
    highed.snackBar = function (stitle, saction, fn) {
        title.innerHTML = stitle.toUpperCase();
        
        if (saction) {
            action.innerHTML = saction.toUpperCase();           
        }

        if (callback) {
            callback();
        }

        highed.dom.style(container, {
            bottom: '10px'
        });

        highed.dom.style(action, {
            display: saction ? '' : 'none'
        });

        callback = highed.dom.on(action, 'click', fn);

        hide();
    };
})();
