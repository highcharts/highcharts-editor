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

/* Turn a DOM node into an overlay 
 * @contents - the DOM node to wrap
 * @attributes - properties for the modal
 */
highed.OverlayModal = function (contents, attributes) {
	var container = highed.dom.cr('div', 'highed-overlay-modal'),
		events = highed.events(),
		properties = highed.merge({
			width: 200,
			height: 200,
			minWidth: 690,
			minHeight: 0
		}, attributes),
		hideDimmer = false,
		visible = false
	;

	///////////////////////////////////////////////////////////////////////////

	function show() {
		if (visible) return;

		highed.dom.style(container, {
			width: properties.width + (properties.width.indexOf('%') > 0 ? '' : 'px'),
			height: properties.height + (properties.height.indexOf('%') > 0 ? '' : 'px'),
			opacity: 1,
			'pointer-events': 'all',
			'min-width': properties.minWidth + 'px',
			'min-height': properties.minHeight + 'px'
		});

		highed.dom.style(document.body, {
			'overflow-x': 'hidden',
			'overflow-y': 'hidden'
		});

		hideDimmer = highed.showDimmer(hide, true);

		setTimeout(function () {
			events.emit('Show');			
		}, 300);

		visible = true;
	}

	function hide() {
		if (!visible) return;

		highed.dom.style(container, {
			width: '0px',
			height: '0px',
			opacity: 0,
			'pointer-events': 'none'
		});

		highed.dom.style(document.body, {
			'overflow-x': '',
			'overflow-y': ''
		});

		if (highed.isFn(hideDimmer)) {
			hideDimmer();
		}

		visible = false;

		events.emit('Hide');
	}

	///////////////////////////////////////////////////////////////////////////
	
	highed.dom.ap(document.body, 
		container
	);

	if (contents) {
		highed.dom.ap(container,
			contents
		);
	}

	///////////////////////////////////////////////////////////////////////////

	//Public interface
	return {
		on: events.on,
		show: show,
		hide: hide,
		body: container
	}
};