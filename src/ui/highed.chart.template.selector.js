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

/** UI for selecting a chart template from the ones defined in meta/highed.meta.charts.js
 *
 *  @example
 *  var picker = highed.ChartTemplateSelector(document.body);
 *  picker.on('Select', function (template) {
 *      console.log('Selected new template:', template);
 *  });
 *
 *  @constructor
 *
 *  @param parent {domnode} - the parent to attach the selector to
 *
 *  @emits Select - when selecting a template
 *    > {object} - the template definition
 *  @emits Hover - when hovering a template
 *    > {object} - the template definition
 */
highed.ChartTemplateSelector = function(parent, chartPreview) {
  var events = highed.events(),
    container = highed.dom.cr('div', 'highed-chart-templates'),
    splitter = highed.HSplitter(container, { leftWidth: 30 }),
    list = highed.List(splitter.left),
    templates = splitter.right,
    catNode = highed.dom.cr('div', 'highed-chart-template-cat-desc'),
    selected = false;

  highed.dom.ap(parent, container);
  splitter.right.className += ' highed-chart-template-frame';

  ///////////////////////////////////////////////////////////////////////////

  function createSampleBtn(target, sample) {
    var btn,
      dset = highed.samples.get(sample);

    if (!dset) {
      return;
    }

    btn = sampleBtn = highed.dom.cr('div', 'highed-ok-button', dset.title);

    highed.dom.on(btn, 'click', function() {
      if (
        confirm(
          'You are about to load the ' +
            dset.title +
            ' sample set. This will purge any existing data in the chart. Continue?'
        )
      ) {
        events.emit('LoadDataSet', dset);
      }
    });

    highed.dom.ap(target, btn);
  }

  function buildCatMeta(catmeta) {
    var title = highed.dom.cr('h3', '', catmeta.id),
      desc = highed.dom.cr('div'),
      samples = highed.dom.cr('div');

    desc.innerHTML = highed.isArr(catmeta.description)
      ? catmeta.description.join('<br/><br/>')
      : catmeta.description || '';

    if (catmeta.samples && catmeta.samples.length > 0) {
      highed.dom.ap(samples, highed.dom.cr('h4', '', 'Sample Data Sets'));

      catmeta.samples.forEach(function(sample) {
        createSampleBtn(samples, sample);
      });
    }

    highed.dom.ap(catNode, title, desc, samples);
  }

  function showTemplates(templateList, masterID, catmeta) {
    var compatible = 0;

    templates.innerHTML = '';
    catNode.innerHTML = '';

    if (catmeta) {
      buildCatMeta(catmeta);
    }

    highed.dom.ap(templates, catNode);

    Object.keys(templateList).forEach(function(key) {
      var t = templateList[key],
        node = highed.dom.cr('div', 'highed-chart-template-container'),
        body = highed.dom.cr('div', 'highed-chart-template-body'),
        preview = highed.dom.cr('div', 'highed-chart-template-thumbnail'),
        titleBar = highed.dom.cr('div', 'highed-chart-template-title', t.title),
        description = highed.dom.cr('div', 'highed-chart-template-description'),
        samples = highed.dom.cr('div', 'highed-chart-template-samples');

      if (t.validator) {
        if (!highed.validators.validate(t.validator, chartPreview || false)) {
          return;
        }
      }

      compatible++;

      (highed.isArr(t.sampleSets)
        ? t.sampleSets
        : (t.sampleSets || '').split('.')
      ).forEach(function(sample, i) {
        if (i === 0) {
          highed.dom.ap(samples, highed.dom.cr('h4', '', 'Sample Data Sets'));
        }

        createSampleBtn(samples, sample);
      });

      description.innerHTML = highed.isArr(t.description)
        ? t.description.join('<br/><br/>')
        : t.description;

      if (selected && selected.id === masterID + key + t.title) {
        node.className =
          'highed-chart-template-container highed-chart-template-preview-selected';
        selected.node = node;
      }

      if (highed.meta.images && highed.meta.images[t.thumbnail]) {
        highed.dom.style(preview, {
          'background-image':
            'url("data:image/svg+xml;utf8,' +
            highed.meta.images[t.thumbnail] +
            '")'
        });
      } else {
        highed.dom.style(preview, {
          'background-image':
            'url(' + highed.option('thumbnailURL') + t.thumbnail + ')'
        });
      }

      highed.dom.on(node, 'click', function() {
        if (selected) {
          selected.node.className = 'highed-chart-template-container';
        }

        node.className =
          'highed-chart-template-container highed-chart-template-preview-selected';

        selected = {
          id: masterID + key + t.title,
          node: node
        };

        // If this is a map, we need to include the map collection
        if (t.constructor === 'Map') {
          var loadedSeries = 0;

          (t.config.series || []).forEach(function(series) {
            function incAndCheck() {
              loadedSeries++;
              if (loadedSeries === t.config.series.length) {
                events.emit('Select', t);
              }
            }

            if (series.mapData) {
              if (highed.isStr(series.mapData)) {
                highed.include(
                  'https://code.highcharts.com/mapdata/' +
                    series.mapData +
                    '.js',
                  function() {
                    series.mapData = Highcharts.maps[series.mapData];
                    incAndCheck();
                  }
                );
              } else {
                incAndCheck();
              }
            } else {
              incAndCheck();
            }
          });
        } else {
          events.emit('Select', t);
        }

        highed.emit('UIAction', 'TemplateChoose', t.title);
      });

      highed.dom.ap(
        templates,
        highed.dom.ap(
          node,
          preview,
          highed.dom.ap(
            body,
            titleBar,
            description,
            // highed.dom.cr('h4', '', 'Sample Data Sets'),
            samples
          )
        )
      );
    });

    if (compatible === 0) {
      highed.dom.ap(
        templates,
        highed.dom.ap(
          highed.dom.cr('div', 'highed-chart-template-404'),
          highed.dom.cr(
            'h4',
            '',
            'None of the templates in this category fits your dataset.'
          ),
          highed.dom.cr('div', '', catmeta ? catmeta.nofits || '' : '')
        )
      );
    } else {
      highed.dom.ap(
        catNode,
        highed.dom.cr(
          'h3',
          'highed-template-choose-text',
          'Choose a template below by clicking it'
        )
      );
    }
  }

  /* Force a resize */
  function resize(w, h) {
    var lsize;

    splitter.resize(w, h);
    list.resize();

    lsize = highed.dom.size(list.container);
    highed.dom.style(templates, {
      minHeight: lsize.h + 'px'
    });
  }

  /* Build the UI */
  function build() {
    list.addItems(highed.templates.getCatArray());
    list.selectFirst();
  }

  ///////////////////////////////////////////////////////////////////////////

  list.on('Select', function(id) {
    var templates = highed.templates.getAllInCat(id);

    highed.emit('UIAction', 'TemplateCatChoose', id);

    if (templates) {
      showTemplates(templates, id, highed.templates.getCatInfo(id));
    }
  });

  build();

  ///////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    resize: resize,
    rebuild: build
  };
};
