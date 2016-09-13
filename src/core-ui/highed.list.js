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

highed.List = function (parent) {
    var container = highed.dom.cr('div', 'highed-list'),
        selectedItem = false,
        events = highed.events(),
        items = []
    ;

    ///////////////////////////////////////////////////////////////////////////

    /* Add an item to the list
     * @item - the item meta for the item to add
     *
     * Meta definition: {
     *   title: '',
     *   click: <function callback>
     * }
     *
     * @returns an interface to interact with the item
     */
    function addItem(item) {
        var node = highed.dom.cr('a', 'item', item.title),
            iexports = {}
        ;

        function select(e) {
            if (selectedItem) {
                selectedItem.node.className = 'item';
            }

            selectedItem = iexports;
            node.className = 'item item-selected';
            events.emit('Select', item.id);

            if (highed.isFn(item.click)) {
                return item.click(e);
            }
        }

        highed.dom.on(node, 'click', select);

        highed.dom.ap(container, node);

        iexports = {
            title: item.title,
            node: node,
            select: select
        };

        items.push(iexports);

        if (!selectedItem) {
            select();
        }

        // if (items.length < 2) {
        //     highed.dom.style(container, {display: 'none'});
        // } else {
        //     highed.dom.style(container, {display: ''});
        // }

        return iexports;
    }

    /* Add a set of items to the list
     * @items - an array of items to add
     */
    function addItems(items) {
        if (highed.isArr(items)) {
            items.forEach(addItem);
        }
    }

    /* Clear all the items in the list
     */
    function clear() {
        container.innerHTML = '';
    }

    /* Force resize of the list */
    function resize() {
        var ps = highed.dom.size(parent);

        highed.dom.style(container, {
            //height: ps.height + 'px'
            height: '100%'
        }); 
    }

    /* Show the list */
    function show() {
        highed.dom.style(container, {

        });
    }

    /* Hide the list */
    function hide() {

    }

    /* Select the first item */
    function selectFirst() {
        if (items.length > 0) {
            items[0].select();
        }
    }

    function select(which) {
        items.some(function (item) {
            if (which === item.title) {
                item.select();
                return true;
            }
        });
    }

    function reselect() {
        if (selectedItem) {
            selectedItem.select();
        }
    }

    function countItems() {
        return items.length;
    }

    ///////////////////////////////////////////////////////////////////////////
    
    highed.dom.ap(parent, container);

    ///////////////////////////////////////////////////////////////////////////

    //Public interface
    return {
        on: events.on,
        addItem: addItem,
        addItems: addItems,
        clear: clear,
        resize: resize,
        show: show,
        hide: hide,
        selectFirst: selectFirst,
        select: select,
        reselect: reselect,
        count: countItems
    };
};