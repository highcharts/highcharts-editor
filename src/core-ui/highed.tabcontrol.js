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

/** Standard tabcontrol component
 *  @example 
 *  var tabs = highed.TabControl(document.body),
 *      tab1 = tabs.createTab({title: 'Tab 1'}),
 *      tab2 = tabs.createTab({title: 'Tab 2'})
 *  ;
 *  //Append things to tab1|tab2.body
 *
 *  @constructor
 *  
 *  @emits Focus {object} - when a new tab gets focus.
 * 
 *  @param parent {domnode} - the node to attach to
 *  @param noOverflow {boolean} - set to true to disable scrollbars
 *  @param extraPadding {boolean} - set to true to have extra padding in bodies
 */
highed.TabControl = function (parent, noOverflow, extraPadding) {
    var container = highed.dom.cr('div', 'highed-tab-control'),
        paneBar = highed.dom.cr('div', 'tabs'),
        body = highed.dom.cr('div', 'body'),
        indicator = highed.dom.cr('div', 'indicator'),
        more = highed.dom.cr('div', 'highed-tab-control-more fa fa-chevron-right'),

        events = highed.events(),
        selectedTab = false,
        tabs = [],
        ctx = highed.ContextMenu()
    ;

    ///////////////////////////////////////////////////////////////////////////

    //Build ctx menu
    function buildCTX() {
        ctx.build(tabs.map(function (tab) {
            return {
                title: tab.title,
                click: tab.focus,
                selected: tab.selected
            };
        }));
    }

    highed.dom.on(more, 'click', function (e) {
        buildCTX();
        ctx.show(e.clientX, e.clientY);
    });

    /** Force a resize of the tab control
     *  @memberof highed.TabControl
     *  @param w {number} - the width, uses parent width if null
     *  @param h {number} - the height, uses parent width if null
     */
    function resize(w, h) {
        var cs = highed.dom.size(parent),
            ps = highed.dom.size(paneBar),
            width = 0
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

        //clientWidth/scrollWidth doesn't produce what we need,
        //so let's check the accumulated width of the tabs.

        tabs.forEach(function (tab) {
            width += highed.dom.size(tab.node).w || 0;
        });

        if (width > paneBar.scrollWidth) {

            highed.dom.style(more, {
                display: 'block'
            });
        } else {
            highed.dom.style(more, {
                display: 'none'
            });
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

    /** Hide the tab control
     *  @memberof highed.TabControl
     */
    function hide() {
        highed.dom.style(container, {
            display: 'none'
        });
    }

    /** Show the tab control
     *  @memberof highed.TabControl
     */
    function show() {
        highed.dom.style(container, {
            display: 'block'
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
     * @memberof highed.TabControl
     * @name createTab
     * @properties - the properties for the tab:
     *   > title {string} - the title of the tab
     * @returns {object} - an interface to the tab
     *    > hide {function} - hide the tab
     *    > show {function} - show the tab
     *    > focus {function} - make the tab active
     *    > visible {function} - returns true if the tab is visible
     *    > body {domnode} - the tab body
     */
    function Tab(properties) {
        var tevents = highed.events(),
            tab = highed.dom.cr('div', 'tab', properties.title),
            tbody = highed.dom.cr('div', 'tab-body'),
            visible = true,
            texports = {
                selected: false
            }
        ;

        if (extraPadding) {
            tbody.className += ' tab-body-padded';
        }

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
                selectedTab.selected = false;

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
            selectedTab.selected = true;
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
            title: properties.title,
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
                    more,
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
        container: container,
        on: events.on,
        createTab: Tab,
        resize: resize,
        selectFirst: selectFirst,
        show: show,
        hide: hide,
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
