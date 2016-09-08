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

/* A standard toolbar.
 * @parent - the node to attach the toolbar to
 */
highed.Toolbar = function (parent, attributes) {
    var properties = highed.merge({
            additionalCSS: []
        }, attributes),
        container = highed.dom.cr('div', 'highed-toolbar ' + properties.additionalCSS.join(' ')),
        left = highed.dom.cr('div', 'left'),
        right = highed.dom.cr('div', 'right'),
        center = highed.dom.cr('div', 'center'),
        iconsRight = highed.dom.cr('div', 'icons')
    ;

    ///////////////////////////////////////////////////////////////////////////
    
    /* Add an icon to the toolbar
     * @icon - an object containing the icon settings. Valid properties are:
     *            * css: the additional css class(s) to use
     *            * click: the function to call when the icon is clicked
     */
    function addIcon(icon) {
        var i = highed.dom.cr('div', 'highed-icon fa ' + (icon.css || ''));

        highed.dom.on(i, 'click', function (e) {
            if (highed.isFn(icon.click)) {
                icon.click(e);
            }
        });

        highed.dom.ap(right, i);
    }

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(parent,
        highed.dom.ap(container,
            left,
            center,
            right
        )
    );

    ///////////////////////////////////////////////////////////////////////////
    
    return {
        container: container,
        addIcon: addIcon,
        left: left,
        center: center,
        right: right
    };
};