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

/* A data table
 * @parent - the node to attach the table to
 *
 * The table must be scrollable.
 * Column headings are edited in-place.
 * Each column heading needs an option to delete the column in question
 * Each row should have a delete icon to delete the row in question
 */
highed.DataTable = function (parent) {
	var container = highed.dom.cr('div', 'highed-data-table'),
		header = highed.dom.cr('div'),
		body = highed.dom.cr('div'),

		//Array of the column titles
		columnMeta = [],
		//The data 
		series = [],
		//Row instance counter
		rowInstanceCount = 0
	;

	///////////////////////////////////////////////////////////////////////////
	
	//Add a new series
	function addSeries() {
		var data = [];

		series.push({
			data: data
		}); 
	}

	//Remove column

	//Create a new row
	function Row() {
		var id = ++rowInstanceCount,
			columns = [],
			rexport = {},
			dataEntry = {}
		;

		//Add columns
		columnMeta.forEach(function () {
			var col = {
				input: highed.dom.cr('input')				
			};

			highed.dom.on(col.input, 'change', function () {
				dataEntry
			});

			columns.push(col);
		});

		rexport {
			delete: function () {

			}
		};

		return rexport;
	}

	///////////////////////////////////////////////////////////////////////////

	///////////////////////////////////////////////////////////////////////////

	return {
		Row: Row
	};
};