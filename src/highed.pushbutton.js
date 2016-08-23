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

/* A simple toggle button component
 * @parent (optional) - the parent to attach the button to
 * @icon - the button icon
 * @state - the innitial state of the button
 */
highed.PushButton = function (parent, icon, state) {
	var button = highed.dom.cr('span', 'highed-pushbutton fa fa-' + icon),
		events = highed.events()
	;

	function updateCSS() {
		if (state) {
			button.className += ' highed-pushbutton-active';
		} else {			
			button.className = button.className.replace(' highed-pushbutton-active', '');
		}
	}

	function set(flag) {
		state = flag;
		updateCSS();
	}

	highed.dom.on(button, 'click', function () {
		state = !state;
		updateCSS();
		events.emit('Toggle', state);
	});

	if (!highed.isNull(parent)) {
		highed.dom.ap(parent, button);
	}

	updateCSS();

	return {
		set: set,
		button: button,
		on: events.on
	};
};