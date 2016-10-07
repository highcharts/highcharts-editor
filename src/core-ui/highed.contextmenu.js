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

/** A context menu component
 *  Does a typicall right-click menu. 
 *  Note that each instance get their own DOM node in the document body.
 *
 *  @example
 *  var ctx = highed.ContextMenu([
 *     {
 *         title: "Hello World",
 *         click: function (e) {
 *             alert('hello world!');   
 *         }   
 *     }
 *  ]);  
 *
 *  @constructor
 *  @param stuff {object} - things to add (optional)
 *      > title {string} - the title of the entry
 *      > click {function} - function to call when selecting the item
 */
highed.ContextMenu = function (stuff) {
    var container = highed.dom.cr('div', 'highed-ctx-container'),
        visible = false,
        dimHide = false
    ;

    ///////////////////////////////////////////////////////////////////////////

    /** Add an entry to the menu
     *  @memberof highed.ContextMenu
     *  @param entry {object} - the definition of the entry to add 
     *    > title {string} - the title of the entry
     *    > click {function} - the function to call when clicking the item
     */
    function addEntry(entry) {
        var item = highed.dom.cr('div', 'highed-ctx-item', entry.title),
            right = highed.dom.cr('div', 'ctx-child-icon fa fa-angle-right'),
            childCtx 
        ;

        if (entry === '-') {
            return highed.dom.ap(container,
                highed.dom.cr('div', 'highed-ctx-sep')
            );
        }

        highed.dom.on(item, 'click', function () {
            if (highed.isFn(entry.click)) {
                entry.click();
            }

            hide();
        });

        if (!highed.isNull(entry.children)) {
            childCtx = highed.ContextMenu(entry.children);

            highed.dom.on(item, 'mouseenter', function (e) {
                childCtx.show(e.clientX, e.clientY);
            });
        }

        highed.dom.ap(container, 
            highed.dom.ap(item, 
                entry.icon ? 
                        highed.dom.cr(
                            'div', 
                            'ctx-child-licon fa fa-' + 
                            entry.icon) 
                        : false,
                        entry.children ? right : false
            )
        );
    }

    /** Show the menu
     *  @memberof highed.ContextMenu
     *  @param x {number} - the x position
     *  @param y {number} - the y position
     */
    function show(x, y) {
        var psize = highed.dom.size(document.body),
            size = highed.dom.size(container)
        ;

        if (visible) return;

        if (x > psize.w - size.w - 20) {
            x = psize.w - size.w - 20;      
        } 

        if (y > psize.h - size.h - 20) {
            y = psize.h - size.h - 20;
        }

        highed.dom.style(container, {
            'pointer-events': 'auto',
            opacity: 1,
            left: x + 'px',
            top: y + 'px'
        });

        visible = true;
        dimHide = highed.showDimmer(hide, true, true, 10);
    }

    /** Hide the menu
     *  @memberof highed.ContextMenu
     */
    function hide() {
        if (!visible) return;

        highed.dom.style(container, {
            'pointer-events': 'none',
            opacity: 0
        });

        if (highed.isFn(dimHide)) {
            dimHide();
        }

        visible = false;
    }

    /** Build a menu
     *  @memberof highed.ContextMenu
     *  @param def {array<object>} - an array of entries
     */
    function build(def) {
        container.innerHTML = '';

        if (highed.isArr(def)) {
            return def.forEach(addEntry);
        }

        Object.keys(def).forEach(function (key) {
            var entry = def[key];
            addEntry(highed.merge({title: key}, entry));
        });
    }

    ///////////////////////////////////////////////////////////////////////////
    
    if (stuff) { build (stuff); }

    highed.ready(function () {
        highed.dom.ap(document.body, container);
    });

    ///////////////////////////////////////////////////////////////////////////

    return {
        addEntry: addEntry,
        show: show,
        hide: hide, 
        build: build
    };
};
