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
  var flatOptions = {};

  function dive(tree) {
    if (tree) {
      if (highed.isArr(tree)) {
        tree.forEach(dive);
      } else if (tree.options) {
        if (highed.isArr(tree.options)) {
          tree.options.forEach(dive);
        } else {
          Object.keys(tree.options).forEach(function(key) {
            dive(tree.options[key]);
          });
        }
      } else if (tree.id) {
        flatOptions[tree.id] = tree;
      }
    }
  }

  dive(highed.meta.optionsExtended);

  /** Simple version of the customizer. Whitelisted options
   *  @constructor
   *  @emits PropertyChange - when a property is modified
   *  @param parent {domnode} - the node to append to
   *  @param attributes {object} - settings
   *    > availableSettings {array} - whitelist of options to include
   */
  highed.SimpleCustomizer = function(parent, attributes) {
    var events = highed.events(),
      container = highed.dom.cr('div', 'highed-simple-customizer'),
      table = highed.dom.cr('table', 'highed-customizer-table'),
      properties = highed.merge(
        {
          availableSettings: [
            'title--text',
            'subtitle--text',
            'colors',
            'chart--backgroundColor',
            'yAxis-title--style',
            'yAxis--type',
            'yAxis--opposite',
            'yAxis--reversed',
            'yAxis-labels--format'
          ]
        },
        attributes
      );

    ////////////////////////////////////////////////////////////////////////

    /** Build the property setter
     *  @memberof highed.SimpleCustomizer
     *  @param options {object} - the current chart options
     */
    function build(options) {
      table.innerHTML = '';

      properties.availableSettings.forEach(function(name) {
        var group = highed.merge(
          {
            text: name.replace(/\-/g, ' '),
            id: name,
            tooltipText: false,
            dataType: 'string',
            defaults: false,
            custom: {},
            values: false
          },
          flatOptions[name]
        );

        highed.dom.ap(
          table,
          highed.InspectorField(
            group.values ? 'options' : group.dataType,
            highed.getAttr(options, group.id, 0) || group.defaults,
            {
              title: group.text,
              tooltip: group.tooltipText,
              values: group.values,
              custom: group.custom,
              defaults: group.defaults,
              attributes: group.attributes || []
            },
            function(newValue) {
              events.emit('PropertyChange', group.id, newValue, 0);
            },
            false,
            group.id
          )
        );
      });
    }

    function highlightNode(n) {
      if (!n) return;

      highed.dom.style(n, {
        border: '2px solid #33aa33'
      });

      n.focus();
      n.scrollIntoView(true);

      window.setTimeout(function() {
        highed.dom.style(n, {
          border: ''
        });
      }, 2000);
    }

    /** Focus a field in the inspector
     *  @memberof highed.SimpleCustomizer
     *  @param thing {object} - the thing to focus
     *    > id {anything} - the id of the field
     *  @param x {number} - the x position the request came from
     *  @param y {number} - the y position the request came from
     */
    function focus(thing, x, y) {
      var id = thing.id;
      if (id.indexOf('-') >= 0) {
        highlightNode(table.querySelector('#' + id));
      }
    }

    ////////////////////////////////////////////////////////////////////////

    highed.ready(function() {
      highed.dom.ap(
        parent,
        highed.dom.ap(
          container,
          highed.dom.cr('div', 'highed-customizer-table-heading', 'Edit Chart'),
          table
        )
      );
    });

    return {
      focus: focus,
      on: events.on,
      build: build
    };
  };
})();
