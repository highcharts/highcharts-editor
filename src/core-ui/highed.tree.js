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

/** Tree component
 *  For an example of formatting, build the editor with `gulp with-advanced`,
 *  and look in `src/meta/highed.options.advanced.js`.
 *
 *  @emits Select {object} - when a node is selected
 *
 *  @constructor
 *  @param parent {domnode} - the node to attach the tree to
 */
highed.Tree = function(parent) {
  var container = highed.dom.cr('div', 'highed-tree'),
    selectedNode = false,
    events = highed.events(),
    expands = {},
    expandState = {},
    selectedID = false,
    selectedPath = false,
    attachedData = {},
    filters = {
      //Filter the series properties based on the series.type property
      series: {
        controller: 'type',
        state: false,
        default: 'line'
      },
      plotOptions: {
        controller: 'type',
        state: false,
        default: 'line'
      }
    };

  ////////////////////////////////////////////////////////////////////////////

  function createNode(child, pnode, instancedData, productFilter, myIndex) {

    var id =  (child.meta.ns ? child.meta.ns + '.' : '') +
    (!isNaN(myIndex) ? '[' + myIndex + '].' : '') +
    child.meta.name;

    var node = highed.dom.cr(
        'div',
        'node',
        '',
        id
      ),
      title = highed.dom.cr(
        'div',
        'parent-title',
        highed.uncamelize(child.meta.title || child.meta.name)
      ),
      body = highed.dom.cr('div', 'parent-body'),
      icon = highed.dom.cr('div', 'exp-col-icon fas fa-folder'),
      rightIcons = highed.dom.cr('div', 'right-icons'),
      remIcon = highed.dom.cr('div', 'highed-icon far fa-minus-square'),
      addIcon = highed.dom.cr('div', 'highed-icon far fa-plus-square'),
      index =
        (child.meta.ns ? child.meta.ns + '.' : '') +
        (myIndex ? '[' + myIndex + '].' : '') +
        //(!isNaN(myIndex) ? '[' + myIndex + '].' : '') +
        child.meta.name,
      expanded = true;

    //child.meta.fullname = index;
    child.meta.fullname = (myIndex ? child.meta.name : index);

    function pushExpandState() {
      if (
        (!child.meta.types.array &&
          typeof expandState[index] !== 'undefined') ||
        expanded
      ) {
        expandState[index] = expanded;
      }
    }

    function select() {
      if (selectedNode) {
        selectedNode.className = 'parent-title';
      }

      selectedNode = title;
      selectedPath = index;

      title.className = 'parent-title parent-title-selected';
      events.emit(
        'Select',
        child,
        title.innerHTML,
        child.data,
        productFilter,
        filters[index] ? child.data[filters[index].controller] || filters[index].default : false
      );
    }

    function expand(noSelect, force) {
      if (
        (force || !expanded) &&
        child.children.length &&
        child.meta.hasSubTree
      ) {
        icon.className = 'exp-col-icon fas fa-folder-open';
        highed.dom.style(body, { display: 'block' });
        expanded = true;
        pushExpandState();
      }

      if (!noSelect) {
        select();
      }

      highed.emit(
        'UIAction',
        'AdvancedTreeNavigation',
        (child.meta.ns ? child.meta.ns + '.' : '') + child.meta.name
      );
    }

    function collapse(noSelect, noPush) {
      if (expanded && child.children.length && child.meta.hasSubTree) {
        icon.className = 'exp-col-icon fas fa-folder';
        highed.dom.style(body, { display: 'none' });
        expanded = false;
        if (!noPush) {
          pushExpandState();
        }
      }

      if (!noSelect) {
        select();
      }
    }

    function toggle(e) {
      if (expanded) {
        collapse();
      } else {
        expand();
      }

      if (e) {
        return highed.dom.nodefault(e);
      }
    }

    function buildSubtree(activeFilter) {
      body.innerHTML = '';

      // Skip this element if it's not part of the current product
      if (
        productFilter &&
        Object.keys(child.meta.products || {}).length > 0 &&
        !child.meta.products[productFilter]
      ) {
        //return false;
      }

      if (child.meta.isArrayElement) {
        highed.dom.ap(node, highed.dom.ap(rightIcons, remIcon));

        highed.dom.on(remIcon, 'click', function(e) {
          if (confirm('Really delete the element? This cannot be undone!')) {
            var delIndex = false;

            if (selectedNode === node) {
              selectedNode.className = 'parent-title';
              selectedNode = false;
              selectedPath = false;
              events.emit('ClearSelection');
            }

            body.parentNode.removeChild(body);
            node.parentNode.removeChild(node);

            // This is a bit convuluted, but we can't do a filter
            child.meta.arrayData.some(function(a, i) {
              if (a === child.data) {
                delIndex = i;
                return true;
              }
            });

            child.meta.arrayData.splice(delIndex, 1);

            events.emit('ForceSave', attachedData);

            highed.snackBar(
              'Removed element ' +
                delIndex +
                ' from ' +
                (child.meta.ns ? child.meta.ns + '.' : '') +
                child.meta.name
            );
          }

          return highed.dom.nodefault(e);
        });
      }

      // This node contains an array of stuff
      if (child.meta.types.array) {
        highed.dom.ap(node, highed.dom.ap(rightIcons, addIcon));

        icon.className = 'exp-col-icon fas fa-th-list';
        // We need to create one child per. existing entry
        child.data = instancedData[child.meta.name] =
          instancedData[child.meta.name] || [];

        // Force it to be an array
        if (!highed.isArr(child.data)) {
          child.data = instancedData[child.meta.name] = [
            instancedData[child.meta.name]
          ];
        }

        function addArrayElementToList(data, i) {
          var cat = {
              meta: {
                name: child.meta.name,
                title: child.meta.name + '[' + i + ']',
                hasSubTree: true,
                arrayData: instancedData[child.meta.name],
                isArrayElement: true,
                types: {
                  object: 1
                }
              },
              data: data,
              // We need to clone the children since the builders
              // add data attributes to them.
              // If we don't clone, all the sub-stuff will link to
              // the last child data accross all instances.
              children: highed.merge([], child.children)
            },
            node = createNode(cat, body, data, productFilter, i);
          if (node) {
            build(cat, node.body, data, productFilter, i);
          }
        }

        highed.dom.on(addIcon, 'click', function() {
          var newElement = {};

          highed.snackBar('Added new element to ' + child.meta.name);
          child.data.push(newElement);
          addArrayElementToList(newElement, child.data.length - 1);

          events.emit('ForceSave', attachedData);
        });

        child.data.forEach(addArrayElementToList);
      } else {
        // Only allow expanding on non-array parents
        highed.dom.on(node, 'click', function() {
          expand();
        });

        highed.dom.on(icon, 'click', toggle);

        if (!child.meta.hasSubTree) {
          icon.className = 'exp-col-icon fas fa-sliders-h';
        }

        // Add data instance
        if (!child.meta.isArrayElement) {
          child.data = instancedData[child.meta.name] =
            instancedData[child.meta.name] || {};
        }

        // Collapsed by default
        if (!expandState[index]) {
          collapse(true, true);
        } else {
          expand(true, true);
        }

        if (index === selectedPath) {
          select();
        }
      }
    }

    ////////////////////////////////////////////////////////////////////////

    highed.dom.ap(pnode, highed.dom.ap(node, icon, title), body);
    
    expands[index] = expand;

    buildSubtree();

    return {
      data: child.data,
      body: body,
      rebuild: buildSubtree
    };
  }

  /** Expand to show a given ID
   *  @memberof highed.Tree
   *  @param id {string} - the ID of the element to expand
   */
  function expandTo(id) {
    var prev = '';

    if (!id) return;

    id = id
      .replace(/\-\-/g, '.')
      .replace(/\-/g, '.')
      .split('.');

    id.forEach(function(seg) {
      seg = prev + seg;
      if (expands[seg]) expands[seg]();
      prev += seg + '.';
    });
  }

  /** Build the tree
   *
   *  This function takes in a transformed, compact, meta definitions
   *  for all entries in the API. The definitions are structured as an actual
   *  tree, where each node has an array of children, and a meta object with
   *  meta information such as data type, default, and GH links.
   *
   *  @memberof highed.Tree
   *  @param tree {object} - the tree to display
   *    > children {object} - the children of the node
   *    > entries {array} - array of orphan children
   *  @param pnode {domnode} - the parent node
   *  @param instancedData {object} - the actual tree data
   *  @param dataIndex {number} - the path to data in arrays
   */
  function build(tree, pnode, instancedData, productFilter, myIndex) {
    if (!tree) {
      return;
    }


    // Handled in createNode, just skip.
    if (tree.meta.types['array']) {
      return;
    }

    if (
      productFilter &&
      Object.keys(tree.meta.products || {}).length > 0 &&
      !tree.meta.products[productFilter]
    ) {
      //return;
    }

    if (highed.isArr(tree.children)) {
      tree.children.forEach(function(child) {
        var node, fstate;

        if (tree.meta.fullname && filters[tree.meta.fullname]) {

          if (child.meta && child.meta.validFor) {

            var customizedSeriesOption = productFilter.series;
            if (myIndex) customizedSeriesOption = [customizedSeriesOption[myIndex]];
            
            var found = false;
            (customizedSeriesOption || []).forEach(function(serieOption) {
              fstate = serieOption[filters[tree.meta.fullname].controller] || filters[tree.meta.fullname].default;
              if (child.meta.validFor[fstate]) found = true;
            });

            if (!found) {
              return;
            }

          }
        }

        if (!child.meta.leafNode) {
          node = createNode(child, pnode, instancedData, productFilter);
          if (node) {
            build(child, node.body, node.data, productFilter);
          }
        }
      });
    }
  }

  function getMasterData() {
    return attachedData;
  }

  function isFilterController(ns, name) {
    if (typeof filters[ns] !== 'undefined') {
      return filters[ns].controller === name;
    }
    return false;
  }

  ////////////////////////////////////////////////////////////////////////////

  highed.dom.ap(parent, container);

  ////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    expandTo: expandTo,
    getMasterData: getMasterData,
    isFilterController: isFilterController,
    build: function(tree, data) {
      attachedData = data;
      container.innerHTML = '';
      build(tree, container, data, data);
    }
  };
};
