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

highed.ChartCustomizer = function (parent, owner) {
	var events = highed.events(),
		splitter = highed.HSplitter(parent),
		list = highed.List(splitter.left),
		body = splitter.right
	;

	///////////////////////////////////////////////////////////////////////////

	function resize() {
		list.resize();
		splitter.resize();
	}

	function selectGroup(group) {
		var sub = highed.dom.cr('table', 'highed-customizer-table'),
			referenced
		;

		if (highed.isArr(group.options)) {
			highed.dom.ap(body, highed.dom.cr('div', 'highed-customizer-table-heading', group.text));

			group.options.forEach(function (sub) {
				selectGroup(sub);
			});
			return;
		} else if (typeof group.id !== 'undefined') {
			//Get the actual meta - need to format the dictionary better..
			referenced = highed.meta.options.filter(function (b) {
				return b._id === group.id;
			});

			if (referenced.length > 0) {
				referenced = referenced[0];
				//highed.dom.ap(sub, highed.dom.cr('span', '', referenced[0].returnType));
				highed.dom.ap(sub, 
					highed.InspectorField(
						referenced.values ? 'options' : referenced.returnType.toLowerCase(), 
						(owner.flatOptions[referenced._id] || referenced.defaults), 
						{
							title: group.text,
							tooltip: group.tooltipText || referenced.description,
							values: referenced.values	
						},
						function (newValue) {
							events.emit('PropertyChange', referenced._id, newValue);
						}
					)
				);
			}

			highed.dom.ap(body, sub);
		}
	}

	function build() {
		Object.keys(highed.meta.optionsExtended.options).forEach(function (key) {
			var entry = highed.meta.optionsExtended.options[key];
			list.addItem({
				title: key,
				click: function () {
					body.innerHTML = '';
					entry.forEach(selectGroup);
				}
			});
		});
	}

	function clear() {

	}

	///////////////////////////////////////////////////////////////////////////
	
	build();

	return {
		on: events.on,
		resize: resize
	};
};