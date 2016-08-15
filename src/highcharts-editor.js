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

//Global namespace

var highed = {
	schemas: {},

	/* Check if something is null or undefined
	 * @what - the value to check
	 * @returns true or false
	 */
	isNull: function (what) {
		return (typeof what === 'undefined' || what == null);
	},

	/* Check if something is a string 
     * @what - the value to check
	 * @returns true if what is a string
	 */
	isStr: function (what) {
		return (typeof what === 'string' || what instanceof String);
	},

	/* Check if something is a number
	 * @what - the value to check
	 * @returns true if what is a number
	 */
	isNum: function(what) {
		return !isNaN(parseFloat(what)) && isFinite(what);
	},

	/* Check if a value is a function
	 * @what - the value to check
	 * @returns true if what is a function
	 */
	isFn: function (what) {
		return (what && (typeof what === 'function') || (what instanceof Function));
	},

	/* Check if a value is an array
  	 * @what - the value to check
	 * @returns true if what is an array
	 */
	isArr: function (what) {
		return (!highed.isNull(what) && what.constructor.toString().indexOf("Array") > -1);
	},

	/* Check if a value is a boolean
	 * @what - the value to check
	 * @returns true if what is a bool
	 */
	isBool: function (what) {
		return (what === true || what === false);
	},

	/* Check if a value is a basic type
     * @what - the value to check
	 * @returns true if what is a basic type 
	 */
	isBasic: function (what) {
		return !highed.isArr(what) && (highed.isStr(what) || highed.isNum(what) || highed.isBool(what) || highed.isFn(what));
	}
};

//Stateful functions
(function () {
	var logLevels = [
			'error',
			'warn',
			'notice',
			'verbose'
		],
		currentLogLevel = 4
	;

	///////////////////////////////////////////////////////////////////////////

	//Set the current log level
	highed.log = function (level, msg) {
		if (level <= currentLogLevel) {
			console.log(logLevels[level - 1] + ':', msg);
		}
	};

})();