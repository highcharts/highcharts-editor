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
highed.installTemplate = function(type, def) {
    var properties = highed.merge({
        title: '',
        config: {},
        tooltipText: ''
    }, def);

    if (typeof highed.meta.chartTemplates === 'undefined') {
        highed.meta.chartTemplates = {};
    }

    if (highed.meta.chartTemplates[type] !== 'undefined' && properties.title.length) {
        highed.meta.chartTemplates[type].templates[properties.title] = properties;
    } 
};

/** Flush templates
 */
highed.flushTemplates = function () {
  highed.meta.chartTemplates = {};
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
highed.addTemplateType = function (type, title) {
    if (typeof highed.meta.chartTemplates === 'undefined') {
        highed.meta.chartTemplates = {};
    }

    if (highed.meta.chartTemplates[type] === 'undefined') {
        highed.meta.chartTemplates[type] = {
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
 highed.installMultipleTemplates = function (templates) {
    if (typeof highed.meta.chartTemplates === 'undefined') {
        highed.meta.chartTemplates = {};
    }

    if (highed.isArr(templates)) {
        templates.forEach(function (template) {
            if (template.type && template.template) {
                highed.installTemplate(template.type, template.template);
            }
        });
    }
 };
