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

/* An editable field
 * @type - the type of widget to use
 * @value - the current value of the field
 * @properties - the properties for the widget
 * @fn - the function to call when the field is changed
 * @returns a DOM node containing the field + label
 */
highed.InspectorField = function (type, value, properties, fn) {
	var 
		fields = {
			string: function () {
				var input = highed.dom.cr('input');

				highed.dom.on(input, 'change', function () {
					if (highed.isFn(fn)) {
						fn(input.value);
					}
				});

				input.value = value;

				return input;
			},
			number: function () {
				return fields.string();				
			},
			range: function () {
				return fields.string();				

			},
			boolean: function () {
				var input = fields.string();				
				input.type = 'checkbox';
				return input;
			},
			color: function () {
				var input = fields.string();	

				function update(col) {
					input.value = col;
					highed.dom.style(input, {
						background: col
					});
				}			

				highed.dom.on(input, 'click', function (e) {
					highed.pickColor(e.clientX, e.clientY, value, function (col) {
						update(col);
						if (highed.isFn(fn)) {
							fn(col);
						}
					});
				});

				update(value);

				return input;
			},
			font: function () {
				return fields.string();				

			},
			configset: function () {
				return fields.string();				
				
			}
		}
	;

	return highed.dom.ap(
		highed.dom.ap(highed.dom.cr('tr'),
			highed.dom.ap(highed.dom.cr('td'),
				highed.dom.cr('span', '', properties.title)
			),
			highed.dom.ap(highed.dom.cr('td'),
				fields[type] ? fields[type]() : fields['string']
			),
			highed.dom.ap(highed.dom.cr('td'),
				highed.dom.cr('span', 'fa fa-help', properties.tooltip)	
			)
		)
	);
};