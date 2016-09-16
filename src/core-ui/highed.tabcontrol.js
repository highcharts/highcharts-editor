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

/** Standard tabcontrol compopnent
 *  @constructor
 *  @param parent {domnode} - the node to attach to
 *  @param noOverflow {boolean} - set to true to disable scrollbars
 */
highed.TabControl = function (parent, noOverflow) {
    var container = highed.dom.cr('div', 'highed-tab-control'),
        paneBar = highed.dom.cr('div', 'tabs'),
        body = highed.dom.cr('div', 'body'),
        indicator = highed.dom.cr('div', 'indicator'),

        events = highed.events(),
        selectedTab = false,
        tabs = []
    ;

    ///////////////////////////////////////////////////////////////////////////

    /** Force a resize of the tab control
     *  @memberof highed.TabControl
     *  @param w {number} - the width, uses parent width if null
     *  @param h {number} - the height, uses parent width if null
     */
    function resize(w, h) {
        var cs = highed.dom.size(parent),
            ps = highed.dom.size(paneBar)
        ;

        highed.dom.style(container, {
            height: (h || cs.h) + 'px'
        });

        highed.dom.style(body, {
            height: (h || cs.h) - ps.h + 'px'
        });
    
        //Also re-focus the active tab
        if (selectedTab) {
            selectedTab.focus();
        }
    }

    /** Select the first tab
     *  @memberof highed.TabControl
     */
    function selectFirst() {
        tabs.some(function (tab) {
            if (tab.visible()) {
                tab.focus();
                return true;
            }
        });
    }

    function updateVisibility() {
        var c = tabs.filter(function (a) {
            return a.visible();
        }).length;

        if (c < 2) {
            highed.dom.style(paneBar, {
                display: 'none'
            });
        } else {
            highed.dom.style(paneBar, {
                display: ''
            });
        }
    }

   

    /* Create and return a new tab
     * @properties - the properties for the tab:
     *   {
     *      "title": "title of tab"
     *   }
     */
    function Tab(properties) {
        var tevents = highed.events(),
            tab = highed.dom.cr('div', 'tab', properties.title),
            tbody = highed.dom.cr('div', 'tab-body'),
            visible = true,
            texports = {}
        ;

        highed.dom.ap(paneBar, tab);
        highed.dom.ap(body, tbody);

        function hide() {
            visible = false;
            highed.dom.style(tab, {display: 'none'});
            updateVisibility();
        }

        function show() {
            visible = true;
            highed.dom.style(tab, {display: ''});
            updateVisibility();
        }

        function focus() {
            if (!visible) {
                return;
            }

            if (selectedTab) {
                selectedTab.node.className = 'tab';

                highed.dom.style(selectedTab.body, {
                    opacity: 0,
  //                  'pointer-events': 'none',
                    'display': 'none'
                });
            }

            highed.dom.style(indicator, {
                width: highed.dom.size(tab).w + 'px',
                left: highed.dom.pos(tab).x + 'px'
            });

            tab.className = 'tab tab-selected';

            highed.dom.style(tbody, {
                opacity: 1,
//                'pointer-events': 'auto',
                'display': 'block'
            });

            selectedTab = texports;
            tevents.emit('Focus');

            events.emit('Focus', texports);
        }

        highed.dom.on(tab, 'click', focus);

        texports = {
            on: tevents.on,
            focus: focus,
            node: tab,
            body: tbody,
            hide: hide,
            show: show,
            visible: function () {
                return visible;
            }
        };

        if (!selectedTab) {
            focus();
        }

        if (noOverflow) {
            highed.dom.style(tbody, {
                overflow: 'hidden'
            });
        }

        tabs.push(texports);

        resize();
        updateVisibility();

        return texports;
    }

    ///////////////////////////////////////////////////////////////////////////
    
    if (!highed.isNull(parent)) {

        highed.dom.ap(parent,
            highed.dom.ap(container, 
                highed.dom.ap(paneBar,
                    indicator
                ),
                body
            )
        );

        resize();
        updateVisibility();
    }

    ///////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        createTab: Tab,
        resize: resize,
        selectFirst: selectFirst,
        /** Get the size of the title bar
         *  @memberof highed.TabControl
         *  @returns {object}
         *    > w {number} - the width of the control
         *    > h {number} - the height of the control
         */
        barSize: function () {
            return highed.dom.size(paneBar);
        }
    };
};