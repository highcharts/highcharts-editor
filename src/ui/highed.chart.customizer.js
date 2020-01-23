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
highed.ChartCustomizer = function(parent, attributes, chartPreview, planCode, dataPage) {
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
      '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading'
    ),
    tabs = highed.TabControl(parent, false, null, true), //Quck fix for now, will change once design finalised.
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
    splitter = highed.dom.cr('div', 'highed-box-simple-container'),
    allOptions,
/*
    splitter = highed.HSplitter(simpleTab.body, {
      leftWidth: 100,
      rightWidth: 100,
      responsive: true
    }),
    */
    list = highed.List(splitter, true, properties, planCode, dataPage),
    body = highed.dom.cr('div'),//splitter.right,
    advSplitter = highed.HSplitter(advancedTab.body, {
      leftWidth: 30
    }),
    advBody = advSplitter.right,
    advTree = highed.Tree(advSplitter.left),
    flatOptions = {},
    chartOptions = {},
    customCodeSplitter = highed.VSplitter(customCodeTab.body, {
      topHeight: 90
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
  highed.dom.ap(simpleTab.body, splitter);
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
        
        chartPreview.on('LoadCustomCode', function(options) {
          var code;

          if (chartPreview) {
            code = chartPreview.getCustomCode() || '';
            if (codeMirrorBox) {
              codeMirrorBox.setValue(code);
            } else {
              customCodeBox.value = code;
            }
          }
        });

        chartPreview.on('UpdateCustomCode', function() {
          chartPreview.setCustomCode(
            codeMirrorBox ? codeMirrorBox.getValue() : customCodeBox.value,
            function(err) {
              customCodeDebug.innerHTML = err;
            }
          );
        });

        chartPreview.setCustomCode(
          codeMirrorBox ? codeMirrorBox.getValue() : customCodeBox.value,
          function(err) {
            customCodeDebug.innerHTML = err;
          }
        );
      }
    }

    var timeout = null;

    if (typeof window['CodeMirror'] !== 'undefined') {
      codeMirrorBox = CodeMirror.fromTextArea(customCodeBox, {
        lineNumbers: true,
        mode: 'application/javascript',
        theme: highed.option('codeMirrorTheme')
      });
      codeMirrorBox.setSize('100%', '100%');
      codeMirrorBox.on('change', function(a, b) {        
        if (JSON.stringify(b.text) !== JSON.stringify(b.removed)) {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            setCustomCode();
          }, 500);
        }
      });
    } else {
      highed.dom.on(customCodeBox, 'change', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          setCustomCode();
        }, 500);
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
    //splitter.resize(w, h - bsize.h - 10);

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
        properties.availableSettings[group.pid] ||
        group.isHeader
      ) {
        doInclude = true;
      }

      return doInclude;
    }

    return true;
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

        var chartType = chartPreview.getConstructor() === 'StockChart'? 'highstock' : 'highcharts';

        highed.meta.optionsAdvanced = highed.transform.advanced(
          highed.meta.optionsAdvanced,
          true,
          chartType
        );

        const series = chartPreview.options.all().series;
        allOptions = highed.merge({}, chartPreview.options.full);//highed.merge({}, chartPreview.options.getCustomized());
        if (series && series.length > 0) {
          series.forEach(function(serie, i) {
            if (allOptions.series && allOptions.series[i]){
              highed.merge(allOptions.series[i], {
                type: serie.type || 'line'
              });
            }
          });
          advTree.build(
            highed.meta.optionsAdvanced,
            allOptions
          );
  
          highed.dom.style(advancedLoader, {
            opacity: 0
          });
          events.emit("AdvancedBuilt");
        }

      }, 10);
    }
  }

  function build() {
    Object.keys(highed.meta.optionsExtended.options).forEach(function(key) {
      if (!shouldInclude(highed.meta.optionsExtended.options[key]) || (highed.chartType ==='Map' && 
      highed.meta.optionsExtended.options[key].some(function(opt){ 
        return opt.mapDisabled === true; 
      }))) {
        return;
      }

      list.addItem({
        id: key,
        title: highed.L(key)
      }, 
      highed.meta.optionsExtended.options[key],
      chartPreview);
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
    /*
    n.scrollIntoView({
      inline: 'nearest'
    });*/

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

      highlightNode(simpleTab.body.querySelector('#' + id), x, y);
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
    list.selectDropdown(thing.dropdown);
  
    advTree.expandTo(thing.id);
    highlightField(thing.id, x, y);
  }

  ///////////////////////////////////////////////////////////////////////////

  list.on('PropertyChange', function(groupId, newValue, detailIndex) {
    events.emit("PropertyChange", groupId, newValue, detailIndex);
  });

  list.on('TogglePlugins', function(groupId, newValue, type) {
    events.emit("TogglePlugins", groupId, newValue, type);
  });

  list.on('Select', function(id) {
    var entry = highed.meta.optionsExtended.options[id];
    body.innerHTML = '';
    entry.forEach(function(thing) {
      //selectGroup(thing);
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
            if (typeof newValue === 'string') newValue = newValue.replace('</script>', '<\\/script>'); //Bug in cloud
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
          entry.meta.name,
          planCode
        )
      );
    });

    highed.dom.ap(
      advBody,
      highed.dom.ap(
        highed.dom.cr('div', 'highed-customize-group highed-customize-advanced'),
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

  function showCustomCode() {
    customCodeTab.focus();
  }

  function showSimpleEditor() {
    simpleTab.focus();
  }

  function showPreviewOptions() {
    outputPreviewTab.focus();
  }

  function showAdvancedEditor() {
    events.emit("AdvanceClicked");
    advancedTab.focus();
  }

  function getAdvancedOptions() {
    return allOptions;
  }
  return {
    /* Listen to an event */
    on: events.on,
    resize: resize,
    init: init,
    focus: focus,
    reselect: list.reselect,
    highlightField: highlightField,
    showCustomCode: showCustomCode,
    showSimpleEditor: showSimpleEditor,
    showAdvancedEditor: showAdvancedEditor,
    showPreviewOptions: showPreviewOptions,
    getAdvancedOptions: getAdvancedOptions
  };
};
