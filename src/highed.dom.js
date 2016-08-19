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

//DOM helper functions 
highed.dom = {
	/* Append a set of nodes to another node
	 * @target - the node to append to
	 * 
	 * Arguments supplied after the @target represents the children to append.
	 *
	 * @return the target
	 */
	ap: function (target) {
		var children = (Array.prototype.slice.call(arguments));
		children.splice(0, 1);

		if (typeof target !== 'undefined' && typeof target.appendChild !== 'undefined') {
			children.forEach(function (child) {
				if (typeof child !== 'undefined' && typeof child.appendChild !== 'undefined') {
					target.appendChild(child);					
				} else {
					highed.log(1, 'child is not valid (highed.dom.ap)');
				}
			});
		} else {
			highed.log(1, 'target is not a valid DOM node (highed.dom.ap)');
		}

		return target;
	},

	/* Create a set of options for a select
	 * @select - the dropdown to add options to
	 * @options - the options as an array or as an object keyed on ID
	 */
	options: function (select, options) {
		if (highed.isNull(options)) {

		} else if (highed.isArr(options)) {
			options.forEach(function (option) {
				highed.dom.ap(select,
					highed.dom.cr('option', '', option, option)
				);
			});
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

	/* Show a node when another is hovered
	 * @parent - the node to listen for the hover on
	 * @child - the node to show when the parent is hovered
	 */
	showOnHover: function (parent, child) {
		highed.dom.on(parent, 'mouseover', function () {
			highed.dom.style(child, {
				opacity: 1,
				'pointer-events': 'all'
			});
		});

		highed.dom.on(parent, 'mouseout', function () {
			highed.dom.style(child, {
				opacity: 0,
				'pointer-events': 'none'
			});
		});
	},

	/* Create a new HTML node
	 * @type - the type of node to create
	 * @cssClass (optional) - the css class to use for the node
	 * @innerHTML (optional) - the inner html of the new node
	 * @id (optional) - the id of the new node
	 *
	 * @returns the new dom node
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

	/* Style a node
	 * @nodes - the node to style. Can also be an array
	 * @style - object containing style properties
	 *
	 * @returns whatever was supplied to @nodes
	 */
	style: function (nodes, style) {
		if (highed.isArr(nodes)) {
			nodes.forEach(function (node) {
				highed.dom.style(node, style);
			});
			return nodes;
		}

		if (nodes) {
			Object.keys(style).forEach(function (p) {
				nodes.style[p] = style[p];
			});
		}
	},

	/* Attach an event listener to a dom node
	 * @target - the dom node to attach to
	 * @event - the event to listen for
	 * @callback - the function to call when the event is emitted
	 * @context (optional) - the context of the callback function
     *
     * @returns a function that can be called to unbind the handler
	 */
	on: function (target, event, callback, context) {
		var s = [];
    
	    if (target === document.body && event === 'resize') {
	      //Need some special magic here eventually.
	    }
	    
	    if (target && target.forEach) {
	      target.forEach(function (t) {
	        s.push(av.on(t, event, callback));
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

	/* Get or set the value of a node
	 * @node - the node to get the value of
	 * @value (optional) - the value to set
	 * @returns the value
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

	/* Get the size of a node
	 * @node - the node to get the size of
	 * @returns the size as an object {w, h}
	 */
	size: function (node) {
		return {
			w: node.clientWidth,
			h: node.clientHeight
		};
	},

	/* Get the position of a node
	 * @node - the node to get the position of
	 * @returns the position as an object {x, y}
	 */
	pos: function (node) {
		return {
			x: node.offsetLeft,
			y: node.offsetTop
		};
	},

	/* Find a node
	 * @node - the node to find. Either a string or an actual node instance
	 * @returns the node or false if the node was not found
	 */
	get: function (node) {
		if (node && node.appendChild) {
			return node;
		}
		return document.getElementById(node) || false;
	}
};