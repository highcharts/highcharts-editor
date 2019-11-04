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

(function() {
  // Samples, keyed on ID
  var samples = {};
  var mapSamples = {};

  highed.samples = {
    /**
         * Add a sample to the sample collection
         *
         * This should be linked to templates too,
         * both in the sense that templates should have a list of
         * ID's for suitable sample data, and in the sense that
         * when displaying sample data it should display what kind of
         * chart types the data is valid for.
         *
         * The latter can be done automatically by cross-checking templates.
         *
         * @param {object} sample - the sample definition
         *    > id {anything} - the ID of the sample
         *    > title {anything} - the sample title
         *    > description {string} - the sample description
         *    > dataset {array<array<object>>} - the sample data
         *    > suitableSeries {object} - the kind of series this is suitable for
         */
    add: function(sample) {
      var options = highed.merge(
        {
          title: 'Untitled Sample',
          description: 'Untitled Sample',
          dataset: [],
          suitableSeries: false,
          products: false
        },
        sample
      );

      if (options.id && !samples[options.id]) {
        samples[options.id] = options;
        return true;
      }

      return false;
    },

    /**
         * Add a map sample, only really used for the honeycomb/circle tilemap in the chart wizard select chart step
         *
         * @param {object} sample - the sample definition
         *    > id {anything} - the ID of the sample
         *    > title {anything} - the sample title
         *    > description {string} - the sample description
         *    > dataset {array<array<object>>} - the sample data
         */
      addMapType: function(type, sample) {
        var options = highed.merge(
          {
            title: 'Untitled Sample',
            description: 'Untitled Sample',
            dataset: [],
            thumbnail: ''
          },
          sample
        );
  
        mapSamples[type] = mapSamples[type] || {};
    
        if (options.id.length) {
          mapSamples[type][options.id] = options;
          return true;
        }
    
        return false;
      },

    /**
         * Do something for each sample
         * @param fn {function} - the callback
         * @param productFilter {string} - the product(s) to include (optional)
         * @param typeFilter {string} - the series type(s) to include (optional)
         */
    each: function(fn, productFilter, typeFilter) {
      if (highed.isFn(fn)) {
        Object.keys(samples).forEach(function(id) {
          fn(samples[id]);
        });
      }
    },

    /**
         * Get a single sample set
         * @param id {string} - the id of the sample set to get
         * @returns {sample|false} - false if 404, sample if found
         */
    get: function(id) {
      return samples[id] || false;
    },

    /**
         * Get a single map type sample set
         * @param type {string} - the type of the sample set to get
         * @returns {sample|false} - false if 404, sample if found
         */

    getMap: function(type) {
      return mapSamples[type] || false;
    }
  };
})();
