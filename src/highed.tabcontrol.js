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

highed.TabControl = function (parent) {
    var container = highed.dom.cr('div', 'highed-tab-control'),
        paneBar = highed.dom.cr('div', 'tabs'),
        body = highed.dom.cr('div', 'body'),
        indicator = highed.dom.cr('div', 'indicator'),

        selectedTab = false
    ;

    ///////////////////////////////////////////////////////////////////////////

    //Force a resize of the tab control
    function resize() {
        var cs = highed.dom.size(parent),
            ps = highed.dom.size(paneBar)
        ;

        highed.dom.style(container, {
            height: cs.h + 'px'
        });

        highed.dom.style(body, {
            height: cs.h - ps.h + 'px'
        });
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
            texports = {}
        ;

        highed.dom.ap(paneBar, tab);
        highed.dom.ap(body, tbody);

        function focus() {
            if (selectedTab) {
                selectedTab.node.className = 'tab';

                highed.dom.style(selectedTab.body, {
                    opacity: 0,
                    'pointer-events': 'none'
                });
            }

            highed.dom.style(indicator, {
                width: highed.dom.size(tab).w + 'px',
                left: highed.dom.pos(tab).x + 'px'
            });

            tab.className = 'tab tab-selected';

            highed.dom.style(tbody, {
                opacity: 1,
                'pointer-events': 'all'
            });

            selectedTab = texports;
            tevents.emit('Focus');
        }

        highed.dom.on(tab, 'click', focus);

        texports = {
            on: tevents.on,
            focus: focus,
            node: tab,
            body: tbody
        };

        if (!selectedTab) {
            focus();
        }

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
    }

    ///////////////////////////////////////////////////////////////////////////

    return {
        createTab: Tab,
        resize: resize
    };
};