/******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

// @format

(function() {
  var dropdownItems = highed.dom.cr(
    'div',
    'highed-dropdown-items highed-dropdown-items-responsive'
  );

  highed.ready(function() {
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
  highed.DropDown = function(parent, extraClasses) {
    var events = highed.events(),
      container = highed.dom.cr('div', 'highed-dropdown ' + extraClasses),
      body = highed.dom.cr('div', 'highed-dropdown-body'),
      arrow = highed.dom.cr('div', 'highed-dropdown-arrow fa fa-caret-down'),
      items = [],
      selectedItem = false,
      expanded = false,
      catcher = false;

    ////////////////////////////////////////////////////////////////////////

    //Build the DOM
    function buildDOM() {
      dropdownItems.innerHTML = '';

      items.forEach(function(item) {
        highed.dom.ap(dropdownItems, item.node);
        //IE fix
        item.node.innerHTML = ''; //item.title();
        
        const icon = highed.dom.cr('span', 'highed-icon-container', (item.icon() ? '<i class="fa fa-' + item.icon() + '" />' : ''));
        highed.dom.style(icon, {
          "margin-right": "5px",
          "color": "rgb(66, 200, 192)"
        });
        highed.dom.ap(item.node, icon, highed.dom.cr('span', '', item.title() || ''));
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
        left: '-20000px',
        'pointer-events': 'none'
      });

      expanded = false;
    }

    //Expand the dropdown
    function expand(e) {
      buildDOM();

      var pos = highed.dom.pos(container, true),
        s = highed.dom.size(container);

      //Quick hack for IE...
      if (!pos || !pos.x) {
        pos = {
          x: 10,
          y: 10
        };
      }

      if (!s || !s.w) {
        s = {
          w: 200,
          h: 200
        };
      }

      //Need to check the height + y to see if we need to move it

      highed.dom.style(dropdownItems, {
        opacity: 1,
        'pointer-events': 'auto',
        left: pos.x + 'px',
        top: pos.y + s.h + 4 + 'px',
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
      if (item && item.id) {
        if (!highed.isBasic(item.id)) {
          item.id = '1234';
        }
      }

      if (highed.isBasic(item)) {
        item = {
          id: item,
          title: item
        };
      }

      if (
        items.filter(function(b) {
          return b.id() === item.id;
        }).length > 0
      ) {
        return false;
      }

      var node = highed.dom.cr('div', 'highed-dropdown-item'),
        id = highed.uuid(),
        index = items.length,
        itemInstance = {
          //The node
          node: node,

          //Get the index
          index: function() {
            return index;
          },

          //Get the ID
          id: function() {
            return id;
          },

          icon: function() {
            return item.icon;
          },

          //Get the title
          title: function() {
            return highed.isStr(item) ? item : item.title || '';
          },

          //Unselect the item
          unselect: function() {
            node.className = 'highed-dropdown-item';
          },

          //Select the item
          select: function() {
            if (selectedItem) {
              selectedItem.unselect();
            }

            node.className =
              'highed-dropdown-item highed-dropdown-item-selected';
            selectedItem = itemInstance;

            body.innerHTML = selectedItem.title();

            events.emit('Change', itemInstance);

            if (item && highed.isFn(item.select)) {
              item.select(itemInstance);
            }

            collapse();
          }, 

          updateOptions: function(updatedItem) {
            item = updatedItem;
          }
        };

      if (!item) {
        return false;
      }

      if (highed.isStr(item) || highed.isNum(item)) {
        node.innerHTML = item;
        id = item;
      } else {
        
        const icon = highed.dom.cr('span', 'highed-icon-container', (item.icon ? '<i class="fa fa-' + item.icon + '" />' : ''));

        highed.dom.style(icon, {
          "margin-right": "5px",
          "color": "rgb(66, 200, 192)"
        });
        
        highed.dom.ap(node, icon, highed.dom.cr('span', '', item.title || ''));
        id = item.id; // || id;

        if (item.selected) {
          itemInstance.select();
        }
      }

      highed.dom.on(node, 'click', function(e) {
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
         *  @param id {anything} - the id to select
         */
    function selectById(id) {
      items.some(function(item) {
        //This is not a typo..
        if (item.id() == id) {
          item.select();
          return true;
        }
      });
    }

    function updateByIndex(index, details) {
      items[index].updateOptions(details);
    }

    /** Set the current selection by index
         *  @memberof highed.DropDown
         *  @param index {number} - the index to select in range [0..item.length]
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

    highed.dom.ap(container, body, arrow);

    highed.dom.on(container, 'click', toggle);

    return {
      container: container,
      selectById: selectById,
      selectByIndex: selectByIndex,
      updateByIndex: updateByIndex,
      addItems: addItems,
      addItem: addItem,
      clear: clear,
      on: events.on
    };
  };
})();
