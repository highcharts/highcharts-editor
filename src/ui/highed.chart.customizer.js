/******************************************************************************

Copyright (c) 2016-2017, Highsoft

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

/** UI For customizing a chart
 *  @todo there be dragons here.
 *  @example
 *  var chart = highed.ChartCustomizer(document.body, {}, chartPreview);
 *
 *  @constructor
 *
 *  @emits PropertyChange - when a property changes
 *    > {string} - the path of the change
 *    > {anything} - the new value
 *    > {number} - the change array index
 *
 *  @param parent {domnode} - the node to attach the editor to
 *  @param attributes {object} - the attributes
 *    > noAdvanced {bool} - set to true to force disable the advance view
 *    > noCustomCode {bool} - set to true to disable custom code view
 *    > noPreview {bool} - set to true to disable option preview view
 *    > availableSettings {string|array} - whitelist of exposed settings
 *  @param chartPreview {ChartPreview} - the chart preview instance
 */
highed.ChartCustomizer = function(parent, attributes, chartPreview) {
  var properties = highed.merge(
      {
        noAdvanced: false,
        noCustomCode: false,
        noPreview: false,
        availableSettings: []
      },
      attributes
    ),
    events = highed.events(),
    advancedLoader = highed.dom.cr(
      'div',
      'highed-customizer-adv-loader',
      'Loading...'
    ),
    tabs = highed.TabControl(parent, true),
    simpleTab = tabs.createTab({
      title: highed.getLocalizedStr('customizeSimple')
    }),
    advancedTab = tabs.createTab({
      title: highed.getLocalizedStr('customizeAdvanced')
    }),
    customCodeTab = tabs.createTab({
      title: highed.getLocalizedStr('customizeCustomCode')
    }),
    outputPreviewTab = tabs.createTab({
      title: highed.getLocalizedStr('customizePreview')
    }),
    previewEditor = highed.dom.cr(
      'textarea',
      'highed-custom-code highed-box-size highed-stretch'
    ),
    previewCodeMirror = false,
    splitter = highed.HSplitter(simpleTab.body, {
      leftWidth: 100,
      responsive: true
    }),
    list = highed.List(splitter.left, true),
    body = splitter.right,
    advSplitter = highed.HSplitter(advancedTab.body, {
      leftWidth: 30
    }),
    advBody = advSplitter.right,
    advTree = highed.Tree(advSplitter.left),
    flatOptions = {},
    chartOptions = {},
    customCodeSplitter = highed.VSplitter(customCodeTab.body, {
      topHeight: 90,
      noOverflow: true
    }),
    customCodeDebug = highed.dom.cr('pre', 'highed-custom-debug'),
    codeMirrorBox = false,
    customCodeBox = highed.dom.cr(
      'textarea',
      'highed-custom-code highed-box-size highed-stretch'
    ),
    highlighted = false;

  //If we're on mobile, completely disable the advanced view
  if (highed.onPhone()) {
    properties.noAdvanced = true;
    properties.noCustomCode = true;
    properties.noPreview = true;
  }

  body.className += ' highed-customizer-body';

  properties.availableSettings = highed.arrToObj(properties.availableSettings);

  highed.dom.ap(parent, advancedLoader);
  highed.dom.ap(outputPreviewTab.body, previewEditor);

  ///////////////////////////////////////////////////////////////////////////

  advancedTab.on('Focus', function() {
    buildTree();
  });

  outputPreviewTab.on('Focus', function() {
    var prev = chartPreview.options.getPreview();

    if (!previewCodeMirror && typeof window.CodeMirror !== 'undefined') {
      previewCodeMirror = CodeMirror.fromTextArea(previewEditor, {
        lineNumbers: true,
        mode: 'application/javascript',
        theme: highed.option('codeMirrorTheme'),
        readOnly: true
      });

      previewCodeMirror.setSize('100%', '100%');
    }

    if (previewCodeMirror) {
      previewCodeMirror.setValue(prev);
    } else {
      previewEditor.readonly = true;
      previewEditor.value = prev;
    }
  });

  function loadCustomCode() {
    var code;

    if (chartPreview) {
      code = chartPreview.getCustomCode() || '';
      if (codeMirrorBox) {
        codeMirrorBox.setValue(code);
      } else {
        customCodeBox.value = code;
      }
    }
  }

  /**
   * Init the custom code stuff
   */
  function initCustomCode() {
    // Build the custom code tab
    highed.dom.ap(customCodeSplitter.top, customCodeBox);

    highed.dom.ap(customCodeSplitter.bottom, customCodeDebug);

    function setCustomCode() {
      highed.emit('UIAction', 'CustomCodeUpdate');
      customCodeDebug.innerHTML = '';
      if (chartPreview) {
        chartPreview.setCustomCode(
          codeMirrorBox ? codeMirrorBox.getValue() : customCodeBox.value,
          function(err) {
            customCodeDebug.innerHTML = err;
          }
        );
      }
    }

    if (typeof window['CodeMirror'] !== 'undefined') {
      codeMirrorBox = CodeMirror.fromTextArea(customCodeBox, {
        lineNumbers: true,
        mode: 'application/javascript',
        theme: highed.option('codeMirrorTheme')
      });
      codeMirrorBox.setSize('100%', '100%');
      codeMirrorBox.on('change', setCustomCode);
    } else {
      highed.dom.on(customCodeBox, 'change', function() {
        setCustomCode();
      });
    }
  }

  /** Force a resize of the editor
   *  @memberof highed.ChartCustomizer
   *  @param w {number} - the new width
   *  @param h {number} - the new height
   */
  function resize(w, h) {
    var bsize, lsize;
    tabs.resize(w, h);
    bsize = tabs.barSize();

    list.resize(w, h - bsize.h);
    splitter.resize(w, h - bsize.h - 10);

    //The customize body needs to have a min-height of the list height
    lsize = highed.dom.size(list.container);

    highed.dom.style(body, {
      minHeight: lsize.h + 'px'
    });

    customCodeSplitter.resize(w, h);

    if (codeMirrorBox) {
      codeMirrorBox.refresh();
    }
  }

  /** Init the customizer
   *  @memberof highed.ChartCustomizer
   *  @param foptions {object} - the customized options
   *  @param coptions {object} - the full chart options
   */
  function init(foptions, coptions, chartp) {
    flatOptions = coptions || {};
    chartOptions = highed.merge({}, foptions || {});
    list.reselect();
    // buildTree();
    chartPreview = chartp || chartPreview;

    customCodeSplitter.resize();
    loadCustomCode();
  }

  function buildBody(entry) {}

  function applyFilter(detailIndex, filteredBy, filter) {
    var selected = list.selected(),
      id = selected.id,
      entry = highed.meta.optionsExtended.options[id];

    if (!selected) return false;

    body.innerHTML = '';

    entry.forEach(function(thing) {
      selectGroup(thing, false, false, detailIndex, filteredBy, filter);
    });

    highlighted = false;
  }

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

  //This function has mutated into a proper mess. Needs refactoring.
  function selectGroup(group, table, options, detailIndex, filteredBy, filter) {
    var master,
      vals,
      doInclude = true,
      container,
      masterNode,
      def;

    options = chartPreview.options.getCustomized();

    if (highed.isArr(group.options)) {
      table = highed.dom.cr('table', 'highed-customizer-table');

      doInclude = shouldInclude(group);

      if (!doInclude) {
        return;
      }

      container = highed.dom.cr('div', 'highed-customize-group');
      masterNode = highed.dom.cr('div', 'highed-customize-master-dropdown');
/*
      highed.dom.ap(
        body,
        highed.dom.ap(
          container,
          highed.dom.cr(
            'div',
            'highed-customizer-table-heading',
            highed.L(group.text)
          ),
          masterNode,
          table
        )
      );*/

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
                body,
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
            attributes: group.attributes || []
          },
          function(newValue) {
            events.emit('PropertyChange', group.id, newValue, detailIndex);
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
              applyFilter(detailIndex, filteredBy, newValue);
            }
          },
          false,
          group.id
        )
      );
    }
  }

  function buildTree() {
    if (properties.noAdvanced) {
      return;
    }

    highed.dom.style(advancedLoader, {
      opacity: 1
    });

    if (properties.noAdvanced || highed.isNull(highed.meta.optionsAdvanced)) {
      advancedTab.hide();
    } else {
      setTimeout(function() {
        highed.meta.optionsAdvanced = highed.transform.advanced(
          highed.meta.optionsAdvanced,
          true
        );

        advTree.build(
          highed.meta.optionsAdvanced,
          highed.merge({}, chartPreview.options.getCustomized())
        );

        highed.dom.style(advancedLoader, {
          opacity: 0
        });
      }, 10);
    }
  }

  function build() {
    Object.keys(highed.meta.optionsExtended.options).forEach(function(key) {
      if (!shouldInclude(highed.meta.optionsExtended.options[key])) {
        return;
      }

      list.addItem({
        id: key,
        title: highed.L(key)
      });
    });

    // buildTree();
  }

  //Highlight a node
  function highlightNode(n, x, y) {
    if (!n) return;

    var p = highed.dom.pos(n);

    if (!simpleTab.selected) {
      simpleTab.focus();
    }

    n.focus();
    n.scrollIntoView({
      inline: 'nearest'
    });

    // Draw a dot where the item was clicked
    var attention = highed.dom.cr('div', 'highed-attention');
    highed.dom.style(attention, {
      width: '10px',
      height: '10px',
      left: x - 5 + 'px',
      top: y - 5 + 'px',
      borderRadius: '50%'
    });
    highed.dom.ap(document.body, attention);

    // Animate it to the corresponding element
    var pos = Highcharts.offset(n);

    var bgColor = n.style.backgroundColor;
    highed.dom.style(attention, {
      width: n.clientWidth + 'px',
      height: n.clientHeight + 'px',
      borderRadius: 0,
      left: pos.left + 'px',
      top: pos.top + 'px'
    });
    window.setTimeout(function() {
      highed.dom.style(n, {
        backgroundColor: window.getComputedStyle(attention).backgroundColor,
        transition: '1s ease background-color'
      });

      attention.parentNode.removeChild(attention);
      attention = null;

      window.setTimeout(function() {
        highed.dom.style(n, {
          backgroundColor: bgColor
        });
      }, 250);
    }, 350);
  }

  //////////////////////////////////////////////////////////////////////////////
  // P U B L I C  F U N S

  /** Highlight a field in the customizer
   *  @memberof highed.ChartCustomizer
   *  @param id {string} - is the id of the field to highlight
   *  @param x {number} - the x coordinate where the focus was triggered
   *  @param y {number} - the y coordinate where the focus was triggered
   */
  function highlightField(id, x, y) {
    if (id.indexOf('-') >= 0) {
      var n = advSplitter.left.querySelector(
        '#' + id.substr(0, id.indexOf('-'))
      );

      highlightNode(body.querySelector('#' + id), x, y);
      highlightNode(advSplitter.right.querySelector('#' + id));

      if (n) {
        n.scrollIntoView({
          block: 'end'
        });
      }
    }
  }

  /** Focus a category
   *  @memberof highed.ChartCustomizer
   *  @param thing {anything} - the category to focus
   *  @param x {number} - the x coordinate where the focus was triggered
   *  @param y {number} - the y coordinate where the focus was triggered
   */
  function focus(thing, x, y) {
    var n;

    list.select(thing.tab);
    advTree.expandTo(thing.id);
    highlightField(thing.id, x, y);
  }

  ///////////////////////////////////////////////////////////////////////////

  list.on('Select', function(id) {
    var entry = highed.meta.optionsExtended.options[id];
    body.innerHTML = '';
    entry.forEach(function(thing) {
      selectGroup(thing);
    });
    highlighted = false;
    highed.emit('UIAction', 'SimplePropCatChoose', id);
  });

  function buildAdvTree(item, selected, instancedData, filter, propFilter) {
    var table = highed.dom.cr('table', 'highed-customizer-table'),
      componentCount = 0;

    advBody.innerHTML = '';

    if (properties.noAdvanced) {
      return;
    }

    item.children.forEach(function(entry) {
      if (!entry.meta.leafNode) {
        return;
      }

      // Skip functions for now
      if (Object.keys(entry.meta.types)[0] === 'function') {
        return;
      }

      if (propFilter && entry.meta.validFor) {
        if (!entry.meta.validFor[propFilter]) {
          // console.log('filtered', entry.meta.name, 'based on', propFilter);
          return false;
        }
      }

      if (
        filter &&
        entry.meta.products &&
        Object.keys(entry.meta.products) > 0 &&
        !entry.meta.products[filter]
      ) {
        return;
      }

      componentCount++;

      entry.values = entry.meta.enumValues;

      highed.dom.ap(
        table,
        highed.InspectorField(
          entry.values
            ? 'options'
            : Object.keys(entry.meta.types)[0] || 'string',
          typeof instancedData[entry.meta.name] !== 'undefined'
            ? instancedData[entry.meta.name]
            : entry.meta.default, //(highed.getAttr(chartOptions, entry.id)  || entry.defaults),
          {
            title: highed.uncamelize(entry.meta.name),
            tooltip: entry.meta.description,
            values: entry.meta.enumValues,
            defaults: entry.meta.default,
            custom: {},
            attributes: entry.attributes || []
          },
          function(newValue) {
            highed.emit(
              'UIAction',
              'AdvancedPropSet',
              (entry.meta.ns ? entry.meta.ns + '.' : '') + highed.uncamelize(entry.meta.name),
              newValue
            );
            instancedData[entry.meta.name] = newValue;
            events.emit('PropertySetChange', advTree.getMasterData());
            if (advTree.isFilterController(entry.meta.ns, entry.meta.name)) {
              buildTree();
            }
          },
          false,
          entry.id
        )
      );
    });

    highed.dom.ap(
      advBody,
      highed.dom.ap(
        highed.dom.cr('div', 'highed-customize-group'),
        highed.dom.cr('div', 'highed-customizer-table-heading', selected),
        table
      )
    );
  }

  advTree.on('ForceSave', function(data) {
    events.emit('PropertySetChange', data);
  });

  advTree.on('ClearSelection', function() {
    advBody.innerHTML = '';
  });

  advTree.on('Select', buildAdvTree);

  advTree.on('DataUpdate', function(path, data) {
    events.emit('PropertyChange', path, data);
  });

  advTree.on('Dirty', function() {
    init(flatOptions, chartOptions);
  });

  tabs.on('Focus', function() {
    init(flatOptions, chartOptions);
  });

  build();
  initCustomCode();

  if (properties.noCustomCode) {
    customCodeTab.hide();
  }

  if (properties.noAdvanced) {
    advancedTab.hide();
  }

  if (properties.noPreview) {
    outputPreviewTab.hide();
  }

  return {
    /* Listen to an event */
    on: events.on,
    resize: resize,
    init: init,
    focus: focus,
    reselect: list.reselect,
    highlightField: highlightField
  };
};
