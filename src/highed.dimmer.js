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
	var dimmer = false,
		unbinder = false
	;
	
	/* Show the dimmer backdrop 
	 * @fn - the function to call when the dimmer is clicked
	 * @autohide - set to true to hide the dimmer when it's clicked
	 */
	highed.showDimmer = function (fn, autohide) {
		if (!dimmer) {
			dimmer = highed.dom.cr('div', 'highed-dimmer');
			highed.dom.ap(document.body, dimmer);
		}

		highed.dom.style(dimmer, {
			'opacity': 0.7,
			'pointer-events': 'all'
		});

		unbinder = highed.dom.on(dimmer, 'click', function (e) {
			
			if (highed.isFn(fn)) {
				fn();
			}
			
			if (autohide) {
				highed.hideDimmer();
			}
		});
	};

	/* Hide the dimmer backdrop */
	highed.hideDimmer = function () {
		if (dimmer) {
			highed.dom.style(dimmer, {
				'opacity': 0,
				'pointer-events': 'none'
			});

			if (highed.isFn(unbinder)) {
				unbinder();
				unbinder = false;
			}
		}
	};
})();
