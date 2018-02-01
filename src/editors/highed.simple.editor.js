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

/** Simple one-pane editor
 *  An essentials-only editor.
 *
 *  @example
 *  var simpleEditor = highed.SimpleEditor(document.body, {
 *      availableSettings: [
 *          'title--text',
 *          'subtitle--text'
 *      ]
 *  });
 *
 *  simpleEditor.on('Change', function (chart) {
 *       console.log(chart.export.html());
 *  });
 *
 *  @constructor
 *  @emits change - when the chart changes
 *    > {highed.ChartPreview} - an instance of the chart preview
 *
 *  @param parent {domnode} - the node to attach to
 *  @param attributes {object} - the options for the editor
 *    > availableSettings {array<string>} - the settings to include
 *    > defaultChartOptions {object} - default chart settings
 *    > importer {object} - options passed to the importer widget
 *      > options {string|array<string>} - the options to include
 *      > plugins {string|array<sting>} - the plugins to enable
 */
highed.SimpleEditor = function(parent, attributes) {
  var properties = highed.merge(
      {
        importer: {
          options: 'csv'
        },
        features: 'import preview customize',
        availableSettings: [
          'title--text',
          'subtitle--text',
          'colors',
          'chart--backgroundColor',
          'yAxis-title--style',
          'yAxis--type',
          'yAxis--opposite',
          'yAxis--reversed',
          'yAxis-labels--format'
        ],
        defaultChartOptions: {}
      },
      attributes
    ),
    events = highed.events(),
    container = highed.dom.cr('div', 'highed-container'),
    expandContainer = highed.dom.cr('div', 'highed-expand-container'),
    mainVSplitter = highed.VSplitter(container, {
      topHeight: '60px',
      noOverflow: true
    }),
    mainToolbar = highed.Toolbar(mainVSplitter.top, {
      additionalCSS: ['highed-header']
    }),
    hsplitter = highed.HSplitter(mainVSplitter.bottom, {
      leftWidth: 40,
      noOverflow: false
    }),
    vsplitterRight = highed.VSplitter(hsplitter.right, {
      noOverflow: true
    }),
    preview = highed.ChartPreview(vsplitterRight.top, {
      defaultChartOptions: properties.defaultChartOptions,
      expandTo: expandContainer
    }),
    //importer = highed.DataImporter(vsplitterRight.bottom, properties.importer),
    importer = highed.DataTable(vsplitterRight.bottom),
    customizer = highed.SimpleCustomizer(hsplitter.left, {
      availableSettings: properties.availableSettings
    }),
    cmenu = highed.DefaultContextMenu(preview);

  ///////////////////////////////////////////////////////////////////////////

  properties.features = highed.arrToObj(properties.features.split(' '));

  ///////////////////////////////////////////////////////////////////////////

  function applyFeatures() {
    if (!properties.features.import) {
      importer.hide();
    }

    if (!properties.features.preview) {
    }

    if (!properties.features.customize) {
    }
  }

  /** Force a resize of the editor
     *  @memberof highed.SimpleEditor
     */
  function resize() {
    var ps = highed.dom.size(container);

    mainVSplitter.resize(ps.w, ps.h);

    vsplitterRight.resize(false, ps.h - 60);

    hsplitter.resize(ps.w, ps.h - 60);

    preview.resize();
    importer.resize();
  }

  function attachToCustomizer() {
    customizer.build(preview.options.customized);
  }

  ///////////////////////////////////////////////////////////////////////////

  customizer.on('PropertyChange', function(id, value, index) {
    preview.options.set(id, value, index);
    events.emit('Change', preview);
  });
  // importer.on('ImportCSV', [preview.data.csv, attachToCustomizer]);
  // importer.on('ImportJSON', [preview.data.json, attachToCustomizer]);
  // importer.on('ImportChartSettings', [preview.data.settings, attachToCustomizer]);

  importer.on('Change', function(headers, data) {
    if (data.length) {
      var d = importer.toDataSeries();

      preview.options.set('xAxis-categories', d.categories, 0);

      preview.loadSeries(d.series);
    }
  });

  preview.on('RequestEdit', function(event, x, y) {
    customizer.focus(event, x, y);
  });

  preview.on('New', attachToCustomizer);

  ///////////////////////////////////////////////////////////////////////////

  highed.dom.ap(highed.dom.get(parent), container, expandContainer);

  highed.dom.on(window, 'resize', resize);

  highed.dom.ap(
    mainToolbar.left,
    highed.dom.style(highed.dom.cr('div', 'highed-logo'), {
      'background-image':
        'url("data:image/svg+xml;utf8,' +
        encodeURIComponent(
          '<?xml version="1.0" encoding="utf-8"?><!-- Generator: Adobe Illustrator 16.0.3, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" id="Warstwa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"     width="425.197px" height="141.732px" viewBox="0 0 425.197 141.732" enable-background="new 0 0 425.197 141.732"     xml:space="preserve"><g>    <path fill="#eeeaea" d="M138.475,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.036,0,1.849,0.813,1.849,1.852v8.436h17.02v-8.436c0-1.037,0.814-1.852,1.85-1.852        c1.036,0,1.85,0.813,1.85,1.852v21.754c0,1.037-0.814,1.851-1.85,1.851c-1.036,0-1.85-0.813-1.85-1.851V69.712z"/>    <path fill="#eeeaea" d="M156.973,79.479c0,1.037-0.814,1.851-1.852,1.851s-1.852-0.813-1.852-1.851V57.725        c0-1.037,0.814-1.852,1.852-1.852s1.852,0.813,1.852,1.852V79.479z"/>    <path fill="#eeeaea" d="M184.125,70.378c0-1.036,0.814-1.774,1.852-1.774c1.034,0,1.852,0.813,1.852,1.849v5.847        c0,0.444-0.226,1.109-0.595,1.479c-2.367,2.369-5.549,3.773-9.176,3.773c-7.178,0-12.949-5.771-12.949-12.948        c0-7.181,5.771-12.949,12.949-12.949c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592        c-0.741,0.738-1.922,0.813-2.663,0.072c-1.702-1.699-3.923-2.736-6.513-2.736c-5.104,0-9.249,4.144-9.249,9.25        c0,5.104,4.146,9.25,9.249,9.25c2.367,0,4.441-0.813,6.067-2.222V70.378z"/>    <path fill="#eeeaea" d="M218.162,69.712h-17.019v9.77c0,1.037-0.817,1.851-1.852,1.851c-1.037,0-1.849-0.813-1.849-1.851V57.725        c0-1.037,0.812-1.852,1.849-1.852c1.034,0,1.852,0.813,1.852,1.852v8.436h17.019v-8.436c0-1.037,0.813-1.852,1.849-1.852        c1.037,0,1.852,0.813,1.852,1.852v21.754c0,1.037-0.813,1.851-1.852,1.851c-1.033,0-1.849-0.813-1.849-1.851V69.712z"/>    <path fill="#eeeaea" d="M242.948,81.552c-7.182,0-12.949-5.771-12.949-12.948c0-7.181,5.77-12.949,12.949-12.949        c3.627,0,6.809,1.405,9.176,3.771c0.738,0.74,0.738,1.852,0,2.592c-0.741,0.738-1.925,0.813-2.666,0.072        c-1.699-1.699-3.92-2.736-6.51-2.736c-5.106,0-9.249,4.144-9.249,9.25c0,5.104,4.143,9.25,9.249,9.25        c2.59,0,4.884-0.962,6.586-2.664c0.74-0.741,1.849-0.741,2.59,0c0.738,0.738,0.738,1.85,0,2.589        C249.756,80.146,246.574,81.552,242.948,81.552z"/>    <path fill="#eeeaea" d="M281.569,69.712h-17.02v9.77c0,1.037-0.813,1.851-1.852,1.851c-1.034,0-1.85-0.813-1.85-1.851V57.725        c0-1.037,0.813-1.852,1.85-1.852c1.035,0,1.852,0.813,1.852,1.852v8.436h17.02v-8.436c0-1.037,0.813-1.852,1.853-1.852        c1.034,0,1.849,0.813,1.849,1.852v21.754c0,1.037-0.813,1.851-1.849,1.851c-1.037,0-1.853-0.813-1.853-1.851V69.712z"/>    <path fill="#eeeaea" d="M308.758,57.503l10.507,20.646c0.223,0.443,0.445,1.036,0.445,1.554c0,1.036-0.668,1.628-1.702,1.628        c-0.741,0-1.481-0.222-2.001-1.258l-3.253-6.438h-13.547l-3.183,6.438c-0.517,1.036-1.256,1.258-1.994,1.258        c-1.037,0-1.702-0.593-1.702-1.628c0-0.519,0.22-1.109,0.442-1.554l10.506-20.646c0.668-1.405,2.002-1.628,2.74-1.628        C306.76,55.875,308.09,56.096,308.758,57.503z M300.985,70.083h9.988l-4.957-9.99L300.985,70.083z"/>    <path fill="#eeeaea" d="M340.159,56.023c4.441,0,8.064,3.255,8.064,7.694c0,3.923-2.813,6.884-6.511,7.549l6.731,7.104        c0.664,0.666,0.889,1.85,0.146,2.516c-0.736,0.741-2.145,0.521-2.886-0.296l-8.729-9.176h-6.511v8.142        c0,1.034-0.815,1.774-1.854,1.774c-1.033,0-1.85-0.813-1.85-1.851V57.873c0-1.035,0.814-1.85,1.85-1.85H340.159z M330.468,59.575        v8.288h9.691c2.59,0,4.367-1.776,4.367-4.146c0-2.365-1.777-4.144-4.367-4.144L330.468,59.575L330.468,59.575z"/>    <path fill="#eeeaea" d="M365.047,59.575h-9.249c-1.033,0-1.849-0.74-1.849-1.776c0-1.034,0.813-1.773,1.849-1.773h22.201        c1.037,0,1.852,0.74,1.852,1.773c0,1.037-0.813,1.776-1.852,1.776h-9.249V79.48c0,1.037-0.813,1.851-1.849,1.851        c-1.037,0-1.854-0.813-1.854-1.851V59.575z"/>    <path fill="#eeeaea" d="M388.724,66.013c0-9.25,5.698-10.359,9.99-10.359c1.035,0,1.85,0.813,1.85,1.85        c0,1.036-0.813,1.851-1.85,1.851c-3.479,0-6.29,0.738-6.29,6.66v5.18c0,9.25-5.698,10.358-9.989,10.358        c-1.035,0-1.85-0.813-1.85-1.85s0.814-1.85,1.85-1.85c3.479,0,6.289-0.74,6.289-6.66V66.013z"/></g><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 42.009,91.171 76.301,76.685 94.465,69.013 "/><polygon fill="#30426B" points="73.7,62.25 76.302,76.685 94.466,69.013 "/><polygon fill="#6699A1" points="67.981,30.52 73.7,62.251 94.465,69.013 "/><polygon fill="#78758C" points="73.7,62.25 94.466,69.013 56.758,56.729 42.009,91.171 76.302,76.685 "/><polygon fill="#A3EDBA" points="42.009,91.171 56.757,56.73 26.442,46.855 "/><polygon fill="#6699A1" points="76.302,76.685 79.628,95.13 94.466,69.013 "/><polygon fill="#8087E8" points="67.981,30.52 56.757,56.73 73.7,62.251 "/></svg>'
        ) +
        '")'
    })
  );

  mainToolbar.addIcon({
    css: 'fa-gear',
    click: function(e) {
      cmenu.show(e.clientX, e.clientY);
    }
  });

  applyFeatures();
  resize();
  attachToCustomizer();

  //Public interface
  return {
    resize: resize,
    on: events.on,
    /** Main toolbar
         *  @type {domnode}
         *  @memberof highed.SimpleEditor
         */
    toolbar: mainToolbar,
    /** The chart preview
         *  @type {highed.ChartPreview}
         *  @memberof highed.SimpleEditor
         */
    chart: preview
  };
};
