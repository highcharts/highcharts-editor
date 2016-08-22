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

/* Data importer widget
 * @parent - the node to attach the widget to
 *
 * @returns an instance of DataImporter
 */
highed.DataImporter = function (parent) {
	var events = highed.events(),
		pasteArea = highed.dom.cr('textarea', 'highed-imp-pastearea'),
		importBtn = highed.dom.cr('button', '', 'Import'),
		importFileBtn = highed.dom.cr('button', '', 'Upload File'),
		delimiter = highed.dom.cr('input')
	;

	///////////////////////////////////////////////////////////////////////////

	pasteArea.value = 
		'Year,Annual mean,5 year mean\n' +
		'1882,-0.28,-0.29\n' +
		'1883,-0.3,-0.29\n' +
		'1884,-0.33,-0.3\n' +
		'1885,-0.32,-0.32\n' +
		'1886,-0.29,-0.32\n' +
		'1887,-0.35,-0.28\n' +
		'1888,-0.28,-0.3\n' +
		'1889,-0.18,-0.3\n' +
		'1890,-0.4,-0.3\n' +
		'1891,-0.29,-0.31\n' +
		'1892,-0.33,-0.34\n' +
		'1893,-0.34,-0.32\n' +
		'1894,-0.35,-0.3\n' +
		'1895,-0.27,-0.26\n' +
		'1896,-0.19,-0.26\n' +
		'1897,-0.16,-0.22\n' +
		'1898,-0.3,-0.19\n' +
		'1899,-0.19,-0.19\n' +
		'1900,-0.11,-0.21\n' +
		'1901,-0.18,-0.22\n' +
		'1902,-0.28,-0.25\n' +
		'1903,-0.32,-0.28\n' +
		'1904,-0.36,-0.29\n' +
		'1905,-0.27,-0.32\n' +
		'1906,-0.22,-0.33\n' +
		'1907,-0.42,-0.33\n' +
		'1908,-0.36,-0.35\n' +
		'1909,-0.37,-0.38\n' +
		'1910,-0.36,-0.36\n' +
		'1911,-0.37,-0.36\n' +
		'1912,-0.34,-0.32\n' +
		'1913,-0.34,-0.27\n' +
		'1914,-0.17,-0.25\n' +
		'1915,-0.11,-0.26\n' +
		'1916,-0.31,-0.27\n' +
		'1917,-0.39,-0.28\n' +
		'1918,-0.35,-0.3\n' +
		'1919,-0.22,-0.27\n' +
		'1920,-0.22,-0.24\n' +
		'1921,-0.16,-0.22\n' +
		'1922,-0.27,-0.22\n' +
		'1923,-0.23,-0.22\n' +
		'1924,-0.24,-0.2\n' +
		'1925,-0.19,-0.18\n' +
		'1926,-0.04,-0.16\n' +
		'1927,-0.17,-0.17\n' +
		'1928,-0.15,-0.15\n' +
		'1929,-0.29,-0.15\n' +
		'1930,-0.11,-0.14\n' +
		'1931,-0.04,-0.15\n' +
		'1932,-0.1,-0.12\n' +
		'1933,-0.22,-0.12\n' +
		'1934,-0.1,-0.13\n' +
		'1935,-0.15,-0.1\n' +
		'1936,-0.07,-0.04\n' +
		'1937,0.04,-0.02\n' +
		'1938,0.08,0.01\n' +
		'1939,-0.01,0.04\n' +
		'1940,0.02,0.04\n' +
		'1941,0.08,0.04\n' +
		'1942,0.01,0.07\n' +
		'1943,0.08,0.08\n' +
		'1944,0.18,0.05\n' +
		'1945,0.05,0.05\n' +
		'1946,-0.07,0.02\n' +
		'1947,-0.01,-0.03\n' +
		'1948,-0.05,-0.07\n' +
		'1949,-0.07,-0.07\n' +
		'1950,-0.17,-0.07\n' +
		'1951,-0.05,-0.04\n' +
		'1952,0.01,-0.05\n' +
		'1953,0.09,-0.04\n' +
		'1954,-0.11,-0.06\n' +
		'1955,-0.12,-0.05\n' +
		'1956,-0.19,-0.05\n' +
		'1957,0.08,-0.02\n' +
		'1958,0.08,0\n' +
		'1959,0.05,0.05\n' +
		'1960,-0.01,0.05\n' +
		'1961,0.07,0.04\n' +
		'1962,0.03,-0.01\n' +
		'1963,0.07,-0.03\n' +
		'1964,-0.21,-0.05\n' +
		'1965,-0.12,-0.06\n' +
		'1966,-0.03,-0.08\n' +
		'1967,0,-0.02\n' +
		'1968,-0.04,0.01\n' +
		'1969,0.08,-0.01\n' +
		'1970,0.03,-0.01\n' +
		'1971,-0.1,0.03\n' +
		'1972,0,0\n' +
		'1973,0.15,-0.01\n' +
		'1974,-0.07,-0.02\n' +
		'1975,-0.03,0.01\n' +
		'1976,-0.15,-0.02\n' +
		'1977,0.14,0.02\n' +
		'1978,0.03,0.07\n' +
		'1979,0.1,0.15\n' +
		'1980,0.2,0.14\n' +
		'1981,0.27,0.18\n' +
		'1982,0.06,0.18\n' +
		'1983,0.27,0.15\n' +
		'1984,0.1,0.13\n' +
		'1985,0.06,0.17\n' +
		'1986,0.13,0.18\n' +
		'1987,0.28,0.2\n' +
		'1988,0.33,0.26\n' +
		'1989,0.21,0.31\n' +
		'1990,0.37,0.28\n' +
		'1991,0.36,0.24\n' +
		'1992,0.13,0.25\n' +
		'1993,0.14,0.26\n' +
		'1994,0.24,0.25\n' +
		'1995,0.4,0.3\n' +
		'1996,0.31,0.39\n' +
		'1997,0.42,0.41\n' +
		'1998,0.59,0.4\n' +
		'1999,0.34,0.44\n' +
		'2000,0.36,0.47\n' +
		'2001,0.5,0.47\n' +
		'2002,0.58,0.5\n' +
		'2003,0.57,0.55\n' +
		'2004,0.49,0.56\n' +
		'2005,0.63,0.57\n' +
		'2006,0.56,0.54\n' +
		'2007,0.59,0.56\n' +
		'2008,0.44,0.56\n' +
		'2009,0.57,0.55\n' +
		'2010,0.64,0.54\n' +
		'2011,0.52,0.59\n' +
		'2012,0.57,0.61\n' +
		'2013,0.62,\n' +
		'2014,0.69,\n'
	;

	///////////////////////////////////////////////////////////////////////////

	highed.dom.ap(parent, 
		highed.dom.cr('div', 'highed-imp-headline', 'Import CSV'),
		pasteArea,
		highed.dom.cr('div', 'highed-imp-help', 'Paste CSV into the above box, or upload a file by clicking the below button.'),
		importFileBtn,
		importBtn
	);

	highed.dom.on(importBtn, 'click', function () {
		events.emit('ImportCSV', {
			itemDelimiter: ',',
			firstRowAsNames: true,
			csv: pasteArea.value
		});
	});

	highed.dom.on(importFileBtn, 'click', function () {
		highed.readLocalFile({
			type: 'text',
			success: function (info) {
				pasteArea.value = info.data;
			}
		});
	});

	///////////////////////////////////////////////////////////////////////////
	
	return {
		on: events.on
	};
};