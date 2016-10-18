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
    var dropdownItems = highed.dom.cr('div', 'highed-dropdown-items');

    highed.ready(function () {
        highed.dom.ap(document.body, dropdownItems);
    });

    /** A stylable dropdown
     *  @constructor
     *
     *  @emits Change - when the selection changes
     *  @emits Open - when the dropdown is opened
     *  @emits Close - when the dropdown is closed 
     *
     *  @param parent {domnode} - the node to attach the dropdown to
     */
    highed.DropDown = function (parent) {
        var events = highed.events(),
            container = highed.dom.cr('div', 'highed-dropdown'),
            body = highed.dom.cr('div', 'highed-dropdown-body'),
            arrow = highed.dom.cr('div', 'highed-dropdown-arrow fa fa-arrow-down'),
            items = [],
            selectedItem = false,
            expanded = false,
            catcher = false
        ;

        ///////////////////////////////////////////////////////////////////////////

        //Build the DOM
        function buildDOM() {
            dropdownItems.innerHTML = '';

            items.forEach(function (item) {
                highed.dom.ap(dropdownItems, item.node);
            });
        }

        //Collapse the dropdown
        function collapse() {
            if (highed.isFn(catcher)) {
                catcher();
                catcher = false;
            }

            //Should update the container 
            if (selectedItem) {
                body.innerHTML = selectedItem.title();
            }

            highed.dom.style(dropdownItems, {
                opacity: 0,
                'pointer-events': 'none'
            });

            expanded = false;
        }

        //Expand the dropdown
        function expand(e) {
            var pos = highed.dom.pos(container, true),
                s = highed.dom.size(container)
            ;

            buildDOM();
     
            //Need to check the height + y to see if we need to move it

            highed.dom.style(dropdownItems, {
                opacity: 1,
                'pointer-events': 'auto',
                left: pos.x + 'px',
                top: pos.y + s.h + 'px',
                width: s.w - 1 + 'px',
                'min-height': s.h + 'px'
            });

            catcher = highed.showDimmer(collapse, true, true, 500);

            expanded = true;
        }

        //Toggle expansion
        function toggle(e) {
            expanded = !expanded;
            if (expanded) {
                return expand(e);
            }
            collapse();

            return expanded;
        }

        /** Add an item to the dropdown
         *  @memberof highed.DropDown
         *  @param item {object} - the item to add
         *    > title {string} - the title of the item
         *    > id {anyting} - the id of the item
         *    > select {function} - function to call when the item is selected
         */
        function addItem(item) {
            var node = highed.dom.cr('div', 'highed-dropdown-item'),
                id = highed.uuid(),
                itemInstance = {
                    //The node
                    node: node,

                    //Get the ID
                    id: function () {
                        return id;
                    },

                    //Get the title
                    title: function () {
                        return node.innerHTML;
                    },

                    //Unselect the item
                    unselect: function () {
                        node.className = 'highed-dropdown-item';
                    },

                    //Select the item
                    select: function () {
                        if (selectedItem) {
                            selectedItem.unselect();
                        }

                        node.className = 'highed-dropdown-item highed-dropdown-item-selected';
                        selectedItem = itemInstance;

                        body.innerHTML = selectedItem.title();
                        
                        events.emit('Change', itemInstance);      

                        if (item && highed.isFn(item.select)) {
                            item.select(itemInstance);
                        }

                        collapse();
                    }
                }
            ;

            if (!item) {
                return false;
            }

            if (highed.isStr(item) || highed.isNum(item)) {
                node.innerHTML = item;
                id = item;
            } else {
                node.innerHTML = item.title || '';
                id = item.id || id;

                if (item.selected) {
                    itemInstance.select();
                }
            }

            highed.dom.on(node, 'click', function (e) {
                itemInstance.select();
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            });

            items.push(itemInstance);

            return itemInstance;
        }

        /** Clear the dropdown
         *  @memberof highed.DropDown
         */
        function clear() {
            items = [];
        }

        /** Add several items to the dropdown
         *  @memberof highed.DropDown
         *  @param itemsToAdd {array} - array of items to add
         */
        function addItems(itemsToAdd) {
            if (highed.isArr(itemsToAdd)) {
                itemsToAdd.forEach(addItem);
            }
        }

        /** Set the current selection by id
         *  @memberof highed.DropDown
         */
        function selectById(id) {
            items.some(function (item) {
                //This is not a typo..
                if (item.id() == id) {
                    item.select();
                    return true;
                }
            });
        }

        /** Set the current selection by index
         *  @memberof highed.DropDown
         */
        function selectByIndex(index) {
            if (index >= 0 && index < items.length) {
                items[index].select();
            }
        }

        ///////////////////////////////////////////////////////////////////////////

        if (parent) {
            parent = highed.dom.get(parent);
            highed.dom.ap(parent, container);
        }

        highed.dom.ap(container,
            body,
            arrow
        );

        highed.dom.on(container, 'click', toggle);

        return {
            container: container,
            selectById: selectById,
            selectByIndex: selectByIndex,
            addItems: addItems,
            addItem: addItem,
            clear: clear,
            on: events.on
        };
    };
})();