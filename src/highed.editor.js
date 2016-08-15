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

highed.Editor = function (parent) {
	var events = highed.events(),

		container = highed.dom.cr('div', 'highed-container'),
		titlebar = highed.dom.cr('div', 'titlebar'),
		titleLabel = highed.dom.cr('span', '', 'HIGHCHARTS EDITOR'),
		settingsBtn = highed.dom.cr('div', 'settings highed-icon fa fa-gear'),

		splitter = false
	;

	///////////////////////////////////////////////////////////////////////////
	
	/* Resize the editor */
	function resize() {
		var cs = highed.dom.size(container),
			ts = highed.dom.size(titlebar)
		;

		// highed.dom.style(container, {
		// 	height: cs.h + 'px'
		// });

		splitter.resize(cs.w, cs.h - ts.h - 10);
		events.emit('Resized');
	}

	///////////////////////////////////////////////////////////////////////////

	//Handle settings click
	highed.dom.on(settingsBtn, 'click', highed.showSettings);

	//Attach to parent node
	parent = highed.dom.get(parent);
	if (parent) {
		highed.dom.ap(parent, 
			highed.dom.ap(container,
				highed.dom.ap(titlebar,
					titleLabel,
					settingsBtn
				)
			)
		);

		splitter = highed.HSplitter(container);


		highed.dom.ap(splitter.right, 
			highed.dom.cr('span', '', 'This is where the chart preview goes')
		);

		resize();
		highed.TabControl(splitter.left).resize();
	} else {
		highed.log(1, 'no valid parent supplied to editor');
	}

	///////////////////////////////////////////////////////////////////////////

	//Public interface
	return {
		/* Attach an event listener
		 * @event - the event to listen for
		 * @callback - the callback to execute when the event is emitted
		 * @context (optional) - the value of the this reference in the callback
		 *
		 * @returns a function that can be called to unbind the listener
		 */
		 on: events.on,

		 /* Force a resize of the editor */
		 resize: resize
	};
};