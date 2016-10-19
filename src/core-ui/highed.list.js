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

/** A list component
 *
 *  Creates a list with selectable items
 *
 *  @example
 *  var list = highed.List(document.body).addItem({
 *      title: 'My Item',
 *      click: function() {
 *          alert('You clicked the item!');   
 *      }   
 *  });  
 *
 *  @constructor
 *  @param parent {domnode} - the node to attach the list to
 */
highed.List = function (parent, responsive) {
    var container = highed.dom.cr('div', 'highed-list'),
        compactIndicator = highed.dom.cr('div', 'highed-list-compact', 'compact'),
        ctx = highed.ContextMenu(),
        selectedItem = false,
        events = highed.events(),
        items = []
    ;

    ///////////////////////////////////////////////////////////////////////////

    /** Add an item to the list
     * @memberof highed.List
     * @param item {object} - the item meta for the item to add
     *   > title {string} - the title as displayed in the list
     *   > id {anything} - the id of the item: used for `highed.List.on('Select')`
     *   > click {function} - function to call when clicking the item
     * @returns {object} - an interface to interact with the item
     *   > id {anything} - the item id
     *   > title {string} - the title of the item
     *   > node {domnode} - the dom node for the item
     *   > select {function} - selects the item if called
     */
    function addItem(item) {
        var node = highed.dom.cr('a', 'item', item.title),
            iexports = {}
        ;

        function select(e) {
            if (selectedItem) {
                selectedItem.selected = false;
                selectedItem.node.className = 'item';
            }

            selectedItem = iexports;
            selectedItem.selected = true;
            node.className = 'item item-selected';
            events.emit('Select', item.id);
            compactIndicator.innerHTML = item.title;

            if (highed.isFn(item.click)) {
                return item.click(e);
            }
        }

        highed.dom.on(node, 'click', select);
        highed.dom.ap(container, node);

        iexports = {
            id: item.id,
            title: item.title,
            node: node,
            select: select,
            selected: false
        };

        items.push(iexports);

        if (!selectedItem) {
            select();
        }

        return iexports;
    }

    /** Add a set of items to the list
     *  @memberof highed.List
     *  @param items {array<object>} - an array of items to add
     */
    function addItems(items) {
        if (highed.isArr(items)) {
            items.forEach(addItem);
        }

        
    }

    /** Clear all the items in the list
     *  @memberof highed.List
     */
    function clear() {
        container.innerHTML = '';
    }

    /** Force resize of the list 
     *  @memberof highed.List
     */
    function resize() {
        var ps = highed.dom.size(parent),
            cs = highed.dom.size(container)
        ;

        if (responsive && ps.h < cs.h) {
            highed.dom.style(compactIndicator, {
                display: 'block'
            });
            highed.dom.style(container, {
                display: 'none'
            });
        } else if (responsive) {
             highed.dom.style(compactIndicator, {
                display: 'none'
            });
            highed.dom.style(container, {
                display: ''
            });
        }

        // highed.dom.style(container, {
        //     //height: ps.height + 'px'
        //     height: '100%'
        // }); 
    }

    /** Show the list 
    *  @memberof highed.List
    */
    function show() {
        highed.dom.style(container, {

        });
    }

    /** Hide the list 
     *  @memberof highed.List
     */
    function hide() {

    }

    /** Select the first item 
     *  @memberof highed.List
     */
    function selectFirst() {
        if (items.length > 0) {
            items[0].select();
        }
    }

    /** Select an item
     *  @memberof highed.List
     *  @param which {string} - the id of the item to select
     */
    function select(which) {
        items.some(function (item) {
            if (which === item.title) {
                item.select();
                return true;
            }
        });
    }

    /** Reselect the current item
     *  @memberof highed.List
     */
    function reselect() {
        if (selectedItem) {
            selectedItem.select();
        }
    }

    /** Count the number of items currently in the list
     *  @memberof highed.List
     */
    function countItems() {
        return items.length;
    }

    /** Get the selected item
     *  @memberof highed.List
     *  @returns {object} - the selected item
     */
    function selected() {
        return selectedItem;
    }
    ///////////////////////////////////////////////////////////////////////////
    
    highed.dom.on(compactIndicator, 'click', function (e) {
        ctx.build(items.map(function (item) {
            return {
                title: item.title,
                click: item.select,
                selected: item.selected
            };
        }));
        ctx.show(e.clientX, e.clientY);
    });

    highed.dom.ap(parent, container, compactIndicator);

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
        selected: selected,
        count: countItems,
        container: container
    };
};
