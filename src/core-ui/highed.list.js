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
 *  @param responsive {boolean} - set to true to get JS-based responsive functionality
 */
highed.List = function(parent, responsive, props, planCode) {
  var container = highed.dom.cr('div', 'highed-list'),
    compactIndicator = highed.dom.cr('div', 'highed-list-compact', 'compact'),
    ctx = highed.ContextMenu(),
    selectedItem = false,
    events = highed.events(),
    items = [],
    dropdowns = {},
    properties = props;

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
  function addItem(item, children, chartPreview) {
    var node = highed.dom.cr('a', 'item', item.title),
      nodeArrow = highed.dom.cr('span', 'item-arrow', '<i class="fa fa-angle-right" aria-hidden="true"></i>'),
      nodeChildren = highed.dom.cr('span', 'highed-list-suboptions', ''),
      iexports = {};

    highed.dom.style(nodeChildren, {
      display: 'none'
    });

    if (item.annotations) {
      const options = [{
        icon: 'circle-thin',
        value: 'circle'
      },{
        icon: 'square-o',
        value: 'square'
      },{
        icon: 'comment-o',
        value: 'label'
      },{
        icon: 'arrows',
        value: 'drag'
      },{
        icon: 'trash',
        value: 'delete'
      }];

      var annotationsContainer = highed.dom.cr('div', 'annotations-container');
      options.forEach(function(option) {
        option.element = highed.dom.cr('div', 'annotations-btn', '<i class="fa fa-' + option.icon + '">');
        highed.dom.on(option.element, 'click', function() {
          var isAnnotating = !(option.element.className.indexOf('active') > -1);

          options.forEach(function(o) {
            o.element.classList.remove('active');
          });

          chartPreview.setIsAnnotating(isAnnotating);
          if (isAnnotating) {
            chartPreview.setAnnotationType(option.value);
            option.element.className += ' active';
          }
        });
        highed.dom.ap(annotationsContainer, option.element);
      });

      node.className += ' no-clickable';
      highed.dom.ap(node, annotationsContainer);


    }
    else {
      highed.dom.ap(node, nodeArrow);
    }
    
    (children || []).forEach(function(thing) {
      selectGroup(thing);
    });

    function shouldInclude(group) {
      var doInclude = false;

      if (Object.keys(properties.availableSettings || {}).length > 0) {
        if (highed.isArr(group)) {
          group.forEach(function(sub) {
            if (shouldInclude(sub)) {
              doInclude = true;
            }
          });
        } else if (highed.isArr(group.options)) {
          group.options.forEach(function(sub) {
            if (shouldInclude(sub)) {
              doInclude = true;
            }
          });
        } else if (
          properties.availableSettings[group.id] ||
          properties.availableSettings[group.pid]
        ) {
          doInclude = true;
        }

        return doInclude;
      }

      return true;
    }


    function applyFilter(detailIndex, filteredBy, filter) {
      var selected = selectedItem, //list.selected(),
        id = selected.id,
        entry = highed.meta.optionsExtended.options[id];

      if (!selected) return false;

      //body.innerHTML = '';

      entry.forEach(function(thing) {
        selectGroup(thing, false, false, detailIndex, filteredBy, filter);
      });

      highlighted = false;
    }
        //This function has mutated into a proper mess. Needs refactoring.
    function selectGroup(group, table, options, detailIndex, filteredBy, filter) {
      var master,
        vals,
        doInclude = true,
        container,
        masterNode,
        def;

      options = chartPreview.options.getCustomized(); //userOptions;//chartPreview.options.getCustomized();

      if (highed.isArr(group.options)) {
        table = highed.dom.cr('div', 'highed-customizer-table');
        doInclude = shouldInclude(group);

        if (!doInclude) {
          return;
        }
        
        container = highed.dom.cr('div', 'highed-customize-group' + (group.dropdown ? ' highed-list-general-drop-down' : ' highed-list-normal'));
        masterNode = highed.dom.cr('div', 'highed-customize-master-dropdown');
        nodeHeading = highed.dom.cr(
          'div',
          'highed-customizer-table-heading' + (group.dropdown ? ' highed-list-general-drop-down-header' : ''),
          highed.L(group.text)
        );

        if (group.dropdown) {
          dropdowns[highed.L(group.text)] = container;
          highed.dom.on(nodeHeading, 'click', function(e) {
            
            if (e.target !== this) {
              Object.keys(dropdowns).forEach(function(d) {
                if (dropdowns[d] !== container) dropdowns[d].classList.remove('active');
              });

              if (container.classList.contains('active')) {
                container.classList.remove('active');
              } else {
                container.className += ' active';
              }
            }

          });
        }


        highed.dom.ap(
          nodeChildren,
          highed.dom.ap(
            container,
            nodeHeading,
            masterNode,
            table
          )
        );

        if (group.filteredBy) {
          filter = highed.getAttr(options, group.filteredBy, detailIndex);
        }

        if (group.controlledBy) {
          master = highed.DropDown();
          highed.dom.style(masterNode, {
            display: 'block'
          });

          if (highed.isStr(group.controlledBy.options)) {
            vals = highed.getAttr(
              options,
              group.controlledBy.options,
              detailIndex
            );

            if (highed.isArr(vals)) {
              
              if (vals.length === 0) {
                highed.dom.ap(
                  parent,
                  highed.dom.cr('i', '', 'No data to display..')
                );
                return;
              }

              master.addItems(
                vals.map(function(t, i) {
                  return (
                    (group.controlledBy.optionsTitle
                      ? t[group.controlledBy.optionsTitle]
                      : '#' + (i + 1)) || '#' + (i + 1)
                  );
                })
              );

              master.selectByIndex(detailIndex || 0);

              master.on('Change', function(selected) {

                detailIndex = selected.index();

                table.innerHTML = '';

                group.options.forEach(function(sub) {
                  if (group.filteredBy) {
                    filter = highed.getAttr(
                      options,
                      group.filteredBy,
                      detailIndex
                    );
                  }
                  selectGroup(
                    sub,
                    table,
                    options,
                    detailIndex,
                    group.filteredBy,
                    filter
                  );
                });
              });

              highed.dom.ap(masterNode, master.container);
              detailIndex = detailIndex || 0;
            } else {
              return;
            }
          }
        }

        //highed.dom.ap(body, table);

        group.options.forEach(function(sub) {
          selectGroup(sub, table, options, detailIndex, group.filteredBy, filter);
        });
      } else if (typeof group.id !== 'undefined') {
        //Check if we should filter out this column
        if (filter && group.subType && group.subType.length) {
          if (!highed.arrToObj(group.subType)[filter]) {
            return;
          }
        }

        if (Object.keys(properties.availableSettings || {}).length > 0) {
          if (
            !properties.availableSettings[group.id] &&
            !properties.availableSettings[group.pid]
          ) {
            return;
          }
        }

        if (typeof group.dataIndex !== 'undefined') {
          detailIndex = group.dataIndex;
        }

        def = highed.getAttr(options, group.id, detailIndex);

        //highed.dom.ap(sub, highed.dom.cr('span', '', referenced[0].returnType));
        
        highed.dom.ap(
          table,
          highed.InspectorField(
            group.values ? 'options' : group.dataType,
            typeof def !== 'undefined'
              ? def
              : filter && group.subTypeDefaults[filter]
                ? group.subTypeDefaults[filter]
                : group.defaults,
            {
              title: highed.L('option.text.' + group.pid),
              tooltip: highed.L('option.tooltip.' + group.pid),
              values: group.values,
              custom: group.custom,
              defaults: group.defaults,
              width: group.width || 100,
              attributes: group.attributes || [],
              warning: group.warning || [],
              header: highed.L(group.pid)
            },
            function(newValue) {
              if (group.header) return;
              if (group.plugins && group.plugins.length > 0) {
                events.emit('TogglePlugins', group.id, newValue);
              }

              if (!group.noChange) events.emit('PropertyChange', group.id, newValue, detailIndex);
              
              highed.emit(
                'UIAction',
                'SimplePropSet',
                highed.L('option.text.' + group.pid),
                newValue
              );

              if (group.id === filteredBy) {
                //This is a master for the rest of the childs,
                //which means that we need to rebuild everything
                //here somehow and check their subType
                nodeChildren.innerHTML = '';
                applyFilter(detailIndex, filteredBy, newValue);
              }
            },
            false,
            group.id,
            planCode
          )
        );
      }
    }

    function select(e) {
      if (selectedItem) {
        selectedItem.selected = false;
        selectedItem.node.className = 'item';
        selectedItem.nodeArrow.innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
        highed.dom.style(selectedItem.nodeChildren, {
          display: "none"
        });
      }
      dropdowns = {};

      nodeArrow.innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>';
      nodeChildren.innerHTML = '';
      var entry = highed.meta.optionsExtended.options[item.id];
      (entry || []).forEach(function(thing) {
        selectGroup(thing);
      });

      highed.dom.style(nodeChildren, {
        display: 'block'
      });
      
      selectedItem = iexports;
      selectedItem.selected = true;
      node.className = 'item item-selected';
      events.emit('Select', item.id);
      compactIndicator.innerHTML =
        '<span class="icon fa fa-th-list"></span>' + item.title;

      if (highed.isFn(item.click)) {
        return item.click(e);
      }
    }

    if (!item.annotations) {
      highed.dom.on(node, 'click', item.onClick || select);
    }
    highed.dom.ap(container, node, nodeChildren);

    iexports = {
      id: item.id,
      title: item.title,
      node: node,
      nodeArrow: nodeArrow,
      nodeChildren: nodeChildren,
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

      items.forEach(function(item) {
        addItem(item);
      });
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
      cs = highed.dom.size(container);

    if (responsive && ps.h < 50 && ps.h !== 0 && ps.h) {
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
    highed.dom.style(container, {});
  }

  /** Hide the list
     *  @memberof highed.List
     */
  function hide() {}

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

    items.some(function(item) {
      if (which === item.title) {
        if (item.selected) return true;
        item.select();
        return true;
      }
    });
  }

  function selectDropdown(dropdownKey) {


    if (dropdowns[dropdownKey].classList.contains('active')) {
      return true;
    }

    Object.keys(dropdowns).forEach(function(d) {
      if (dropdowns[d] !== dropdowns[dropdownKey]) dropdowns[d].classList.remove('active');
    });

    if (!dropdowns[dropdownKey].classList.contains('active')) {
      dropdowns[dropdownKey].className += ' active';
    }

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

  highed.dom.on(compactIndicator, 'click', function(e) {
    ctx.build(
      items.map(function(item) {
        return {
          title: item.title,
          click: item.select,
          selected: item.selected
        };
      })
    );
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
    selectDropdown: selectDropdown,
    reselect: reselect,
    selected: selected,
    count: countItems,
    container: container
  };
};
