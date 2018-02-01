/*******************************************************************************

Copyright (c) 2016-2018, Highsoft

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

// @format

/* Keeps track of validations */

(function() {
  // Keyed on ID
  var validators = {};

  highed.validators = {
    /**
         * Add a validator
         * @param id {string} - the id
         * @param fn {function} - the validator function
         */
    add: function(id, fn) {
      if (id && !validators[id] && highed.isFn(fn)) {
        validators[id] = fn;
        return true;
      }

      return false;
    },

    /**
         * Execute a validator
         * @param id {string} - the id of the validator
         * @param chart {Chart} - the charts whose data to validate
         * @return {boolean} - true if valid
         */
    validate: function(id, chart) {
      return validators[id] ? validators[id](chart) : true;
    }
  };
})();
