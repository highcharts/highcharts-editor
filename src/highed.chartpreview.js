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

/* Basic chart preview
 * This is just a facade to Highcharts.Chart mostly.
 * It implements a sliding drawer type widget,
 * where the initial state can be as part of the main DOM,
 * and where the expanded state covers most of the screen (90%)
 */
highed.ChartPreview = function (attributes) {
	var events = highed.events(),
		customizedOptions = {},
		flatOptions = {},	
		properties = highed.merge({

		}, attributes)
	;

	///////////////////////////////////////////////////////////////////////////

	/* Load a template from the meta
	 * @template - the template object
	 */
	function loadTemplate(template) {

	}

	/* Load CSV data
	 * @data - the data to load
	 */
	function loadCSVData(data) {

	}

	/* Load JSON data
	 * Functionally, this only instances a new
	 * chart with the supplied data as its options.
	 * It accepts both a string and and object
	 * @data - the data to load
	 */
	function loadJSONData(data) {
		if (highed.isStr(data)) {
			try {
				loadJSONData(JSON.parse(data));
			} catch (e) {
				highed.snackBar('invalid json: ' + e);
			}
		} else if (highed.isBasic(data)) {
			highed.snackBar('the data is not valid json');
		} else {

		}
	}

	/* Set an attribute
	 * @id - the path of the attribute
	 * @value - the value to set
	 */
	function set(id, value) {

	}

	/* Expand the chart from its drawer
	 */
	function expand() {

	}

	/* Collapse the chart into its drawer
	*/
	function collapse() {

	}

	///////////////////////////////////////////////////////////////////////////
	
	///////////////////////////////////////////////////////////////////////////

	return {
		expand: expand,
		collapse: collapse,
		loadTemplate: loadTemplate,
		set: set,
		customizedOptions: customizedOptions,
		flatOptions: flatOptions
	};
};