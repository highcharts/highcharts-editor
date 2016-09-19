/*******************************************************************************

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

/** Namespace for DOM helper functions 
 * @ignore
 */
highed.dom = {
    /** Append a set of nodes to another node.
     * Arguments supplied after the @param {} target represents the children to append.
     * @namespace highed.dom
     * @param target {object} - the node to append to
     * @return {domnode} - the target
     */
    ap: function (target) {
        var children = (Array.prototype.slice.call(arguments));
        children.splice(0, 1);

        target = highed.dom.get(target);
        
        if (!highed.isNull(target) && typeof target.appendChild !== 'undefined') {
            children.forEach(function (child) {
                if (highed.isArr(child)) {
                  child.forEach(function (sc) {
                    highed.dom.ap(target, sc);
                  });
                } else if (typeof child !== 'undefined' && typeof child.appendChild !== 'undefined') {
                    target.appendChild(child);                  
                } else if (child !== false) {
                    highed.log(1, 'child is not valid (highed.dom.ap)');
                }
            });
        } else {
            highed.log(1, 'target is not a valid DOM node (highed.dom.ap)');
        }

        return target;
    },

    /** Create a set of options for a select
     * @namespace highed.dom
     * @param select {HTMLSelect} - the dropdown to add options to
     * @param options {(array|object)} - the options as an array or as an object keyed on ID
     */
    options: function (select, options, selected) {
        if (highed.isNull(options)) {

        } else if (highed.isArr(options)) {
            options.forEach(function (option) {
                highed.dom.ap(select,
                    highed.dom.cr('option', '', option, option)
                );
            });

            if (selected) {
              select.selectedIndex = selected;
            }
        } else if (highed.isStr(options)) {
            try {
                highed.dom.options(select, JSON.parse(options));
            } catch (e) {
                highed.log(e + ' in highed.options (json parser)');
            }
        } else {
            Object.keys(options).forEach(function (key) {
                highed.dom.ap(select,
                    highed.dom.cr('option', '', options[key], key)
                );
            });
        }
    },

    /** Show a node when another is hovered
     * @namespace highed.dom
     * @param parent {object} - the node to listen for the hover on
     * @param child {object} - the node to show when the parent is hovered
     */
    showOnHover: function (parent, child) {
        if (highed.isArr(child)) {
            child.forEach(function (c) {
                highed.dom.showOnHover(parent, c);
            });
            return;
        }

        highed.dom.on(parent, 'mouseover', function () {
            highed.dom.style(child, {
                //display: 'block',
                opacity: 1,
            //  background: 'rgba(46, 46, 46, 0.85)',
                'pointer-events': 'auto'
            });
        });

        highed.dom.on(parent, 'mouseout', function () {
            highed.dom.style(child, {
                //display: 'none',
                opacity: 0,
                //background: 'rgba(0, 0, 0, 0)',
                'pointer-events': 'none'
            });
        });
    },

    /** Create a new HTML node
     * @namespace highed.dom
     * @param type {string} - the type of node to create
     * @param cssClass {string} (optional) - the css class to use for the node
     * @param innerHTML {string} (optional) - the inner html of the new node
     * @param id {string} (optional) - the id of the new node
     *
     * @return {domnode} - the new dom node
     */
    cr: function (type, cssClass, innerHTML, id) {
        var res = false;

        if (typeof type !== 'undefined') {
            res = document.createElement(type);
            
            if (typeof cssClass !== 'undefined') {
                res.className = cssClass;
            }

            if (typeof innerHTML !== 'undefined') {
                res.innerHTML = innerHTML;
            }

            if (typeof id !== 'undefined') {
                res.id = id;
            }
        } else {
            highed.log(1, 'no node type supplied (highed.dom.cr');          
        }

        return res;
    },

    /** Style a node
     * @namespace highed.dom
     * @param nodes {(object|array)}  - the node to style. Can also be an array
     * @param style {object} - object containing style properties
     *
     * @return {anything} - whatever was supplied to @param {} nodes
     */
    style: function (nodes, style) {
        if (highed.isArr(nodes)) {
            nodes.forEach(function (node) {
                highed.dom.style(node, style);
            });
            return nodes;
        }

        if (nodes && nodes.style) {
            Object.keys(style).forEach(function (p) {
                nodes.style[p] = style[p];
            });
          return nodes;
        }
        return false;
    },

    /** Attach an event listener to a dom node
     * @namespace highed.dom
     * @param target {object} - the dom node to attach to
     * @param event {string} - the event to listen for
     * @param callback {function} - the function to call when the event is emitted
     * @param context {object} (optional) - the context of the callback function
     *
     * @return {function} - a function that can be called to unbind the handler
     */
    on: function (target, event, callback, context) {
        var s = [];

        if (!target) {
          return function () {};
        }
    
        if (target === document.body && event === 'resize') {
          //Need some special magic here eventually.
        }
        
        if (target && target.forEach) {
          target.forEach(function (t) {
            s.push(highed.dom.on(t, event, callback));
          });
        }
        
        if (s.length > 0) {
          return function () {
            s.forEach(function (f) {
              f();
            });
          };
        }

        function actualCallback() {
          if (highed.isFn(callback)) {
            return callback.apply(context, arguments);
          }
          return;
        }

        if (target.addEventListener) {
          target.addEventListener(event, actualCallback, false);
        } else {
          target.attachEvent('on' + event, actualCallback, false);
        }   

        return function () {
          if (window.removeEventListener) {
            target.removeEventListener(event, actualCallback, false);
          } else {
            target.detachEvent('on' + event, actualCallback);
          }
        };
    },

    /** Get or set the value of a node
     * @namespace highed.dom
     * @param node {object} - the node to get the value of
     * @param value {(string|bool|number)} (optional) - the value to set
     * @return {anything} - the value
     */
    val: function (node, value) {
        if (node.tagName === 'SELECT') {
            if (node.selectedIndex >= 0) {
                if (!highed.isNull(value)) {
                    for (var i = 0; i < node.options.length; i++) {
                        if (node.options[i].id === value) {
                            node.selectedIndex = i;
                            break;
                        }
                    }
                }
                return node.options[node.selectedIndex].id;
            }           
        } else if (node.tagName === 'INPUT') {
            if (node.type === 'checkbox') {
                if (!highed.isNull(value)) {
                    node.checked = highed.toBool(value);
                }
                return node.checked;
            }
            if (!highed.isNull(value)) {
                node.value = value;
            }
            return node.value;
        } else {
            if (!highed.isNull(value)) {
                node.innerHTML = value;
            }
            return node.innerText;
        }

        return false;
    },

    /** Get the size of a node
     * @namespace highed.dom
     * @param node {object} - the node to get the size of
     * @return {object} - the size as an object `{w, h}`
     */
    size: function (node) {
        return {
            w: node.clientWidth,
            h: node.clientHeight
        };
    },

    /** Get the position of a node
     * @namespace highed.dom
     * @param node {object} - the node to get the position of
     * @return {object} - the position as an object `{x, y}`
     */
    pos: function (node) {
        return {
            x: node.offsetLeft,
            y: node.offsetTop
        };
    },

    /** Find a node
     * @namespace highed.dom
     * @param node {object} - the node to find. Either a string or an actual node instance
     * @return {object} - the node or false if the node was not found
     */
    get: function (node) {
        if (node && node.appendChild) {
            return node;
        }
        return document.getElementById(node) || false;
    }
};