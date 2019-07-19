/******************************************************************************

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

highed.templates = {};

(function() {
  /* Templates */
  var templates = {},
      mostPopularTemplates = {};

  /** Install a new template
     *
     *  @example
     *  highed.installTemplate('custom', {
     *      title: 'My company template',
     *      tooltipText: 'Company template: requires no particular data',
     *      config: {
     *           'chart--title': 'Company Chart'
     *      }
     *  });
     *
     *  @param type {string} - template type: `line area column bar scatter pie polar stock`
     *  @param def {object} - the template definition
     *    > title {string} - the template title
     *    > config {object} - the highcharts attributes
     *    > tooltipText {string} - the tooltip text
     */
  highed.templates.add = function(type, def) {
    var properties = highed.merge(
      {
        title: '',
        description: '',
        constructor: '',
        thumbnail: '',
        icon: '',
        sampleSets: [],
        validator: false,
        config: {}
      },
      def
    );

    if (!highed.isBasic(type)) {
      return false;
    }

    templates[type] = templates[type] || {
      description: '',
      icon: '',
      sampleData: [],
      templates: {}
    };

    if (properties.title.length) {
      if (properties.popular) {
        properties.parent = type;
        mostPopularTemplates[type] = properties;
      }

      if (properties.icon) templates[type].icon = properties.icon;
      templates[type].templates[properties.title] = properties;
      highed.log(4, '[templateman] - added template', properties.title);
      return true;
    }

    return false;
  };

  /**
     * Do something for each template
     * @param fn {function} - the callback
     */
  highed.templates.each = function(fn) {
    if (highed.isFn(fn)) {
      Object.keys(templates).forEach(function(cat) {
        Object.keys(templates[cat].templates).forEach(function(id) {
          fn(cat, templates[cat].templates[id]);
        });
      });
    }
  };

  /**
     * Do something for each template within a given category
     * @param cat {string} - the category to filter by
     * @param fn {function} - the callback
     */
  highed.templates.eachInCategory = function(cat, fn) {
    if (highed.isFn(fn) && templates[cat]) {
      Object.keys(templates[cat].templates).forEach(function(id) {
        fn(templates[cat].templates[id]);
      });
    }
  };

  /**
     * Get a reference to the templates within a given category
     */
  highed.templates.getAllInCat = function(cat) {
    return templates[cat] ? templates[cat].templates : false;
  };

  /**
     * Get category meta
     */
  highed.templates.getCatInfo = function(cat) {
    return highed.merge(
      {
        id: cat
      },
      templates[cat] || {}
    );
  };


  highed.templates.getMostPopular = function() {
    return mostPopularTemplates;
  }

  /**
     * Get a list of id/title pairs for templates
     */
  highed.templates.getCatArray = function() {
    return Object.keys(templates).map(function(cat) {
      return {
        id: cat,
        title: cat,
        icon: templates[cat].icon
      };
    });
  };



  /**
     * Get a list of id/title pairs for selected template
     */
  highed.templates.getCatObj = function(cat) {
    return [{
      id: cat,
      title: cat,
      icon: templates[cat].icon
    }]
  };
  

  /**
     * Add meta information to a category
     */
  highed.templates.addCategory = function(id, meta) {
    templates[id] = templates[id] || {
      templates: {}
    };

    highed.merge(templates[id], meta, false, { templates: 1 });
  };

  /**
     * Do something with each category
     * @param fn {function} - the callback
     */
  highed.templates.eachCategory = function(fn) {
    if (highed.isFn(fn)) {
      Object.keys(templates).forEach(function(id) {
        fn(id, templates[id]);
      });
    }
  };

  /** Flush templates */
  highed.templates.flush = function() {
    templates = {};
  };

  /** Add a new template type
     *  If the type already exists, nothing will happen
     *
     *  @example
     *  highed.addTemplateType('custom', 'My company templates');
     *
     *  @param type {string} - the type id
     *  @param title {string} - the title as it appears in the category list
     */
  highed.templates.addType = function(type, title) {
    if (typeof templates === 'undefined') {
      templates = {};
    }

    if (typeof templates[type] === 'undefined') {
      templates[type] = {
        title: title,
        templates: {}
      };
    }
  };

  /** Add a set of templates
      * @example
      * highed.installMultipleTemplates([
      *   {type: 'line', template: {title: 'My Line Template', config: {}}}
      * ]);
      *
      * @param templates {array} - an array of templates
      *
      */
  highed.templates.addMultiple = function(templates) {
    if (typeof templates === 'undefined') {
      templates = {};
    }

    if (highed.isArr(templates)) {
      templates.forEach(function(template) {
        if (template.type && template.template) {
          highed.installTemplate(template.type, template.template);
        }
      });
    }
  };
})();
