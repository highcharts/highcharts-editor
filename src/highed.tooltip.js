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

(function () {
	var container = highed.dom.cr('div', 'highed-tooltip')
	;

	highed.ready(function () {
		highed.dom.ap(document.body, container);
	});

	function hide() {
		highed.dom.style(container, {
			opacity: 0,
			'pointer-events': 'none'
		});
	}

	highed.dom.on(container, 'mouseout', hide);
	highed.dom.on(container, 'click', hide);

	highed.Tooltip = function (x, y, tip, blowup) {
		highed.dom.style(container, {
			opacity: 1,
			'pointer-events': 'all',
			left: x - 20 + 'px',
			top: y - 20 + 'px',
			width: '200px'
		});

		if (blowup) {
			highed.dom.style(container, {
				width: '90%',
				height: '90%',
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, 0)'
			});
		}

		container.innerHTML = tip;
	};
})();
