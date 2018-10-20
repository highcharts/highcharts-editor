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

/* global window */

highed.TemplatePage = function(parent, options, chartPreview, chartFrame, props) {
  var events = highed.events(),
    // Main properties
    properties = highed.merge(
      {
        defaultChartOptions: {},
        useHeader: true,
        features: [
          'data',
          'templates',
          'customize',
          'customcode',
          'advanced',
          'export'
        ],
        importer: {},
        dataGrid: {},
        customizer: {},
        toolbarIcons: []
      },
      options
    ),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    title, // = highed.dom.cr('div', 'highed-toolbox-body-title', props.title),
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents highed-toolbox-defaultpage highed-toolbox-templatepage'
    ),
    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    iconClass,
    icon = highed.dom.cr('div', iconClass),
    helpModal,
    // Data table
    templatesContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    templates,
    /*customizer = highed.ChartCustomizer(
      customizerContainer,
      properties.customizer,
      chartPreview
    ),*/
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ), 
    iconsContainer = highed.dom.cr('div', 'highed-toolbox-icons'),
    isVisible = false;

  //customizer.on('PropertyChange', chartPreview.options.set);
  //customizer.on('PropertySetChange', chartPreview.options.setAll);
  
  function init() {
    title = highed.dom.cr('div', 'highed-toolbox-body-title'/*, props.title*/);
    iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon;

    templatesContainer.innerHTML = '';
    templates = highed.ChartTemplateSelector(templatesContainer, chartPreview);
    helpModal = highed.HelpModal(props.help || []);

    templates.on('Select', function(template) {
      //chartPreview.loadTemplate(template);
      events.emit('TemplateChanged', template);
    });

    templates.on('LoadDataSet', function(sample) {
      if (sample.type === 'csv') {
        if (highed.isArr(sample.dataset)) {
          chartPreview.data.csv(sample.dataset.join('\n'));
        } else {
          chartPreview.data.csv(sample.dataset);
        }
  
        chartPreview.options.set('subtitle-text', '');
        chartPreview.options.set('title-text', sample.title);
      }
    });
  
    contents.innerHTML = '';

    highed.dom.ap(userContents, templatesContainer);
    highed.dom.ap(contents, /*highed.dom.ap(title, highed.dom.ap(iconsContainer, helpIcon)),*/ userContents);
    highed.dom.ap(body, contents);
    highed.dom.ap(parent, highed.dom.ap(container,body));
    templates.resize();
  
    expand();
    hide();
  }

  function selectSeriesTemplate(index, projectData) {
    templates.selectSeriesTemplate(index, projectData);
  }

  function createMostPopularTemplates(toNextPage) {
    const mostPopular = highed.templates.getMostPopular();
    const container = highed.dom.cr('div', 'highed-toolbox-templates-container');
    
    Object.keys(mostPopular).forEach(function(key) {
      const preview = highed.dom.cr('div', 'highed-chart-template-thumbnail'),
            titleBar = highed.dom.cr('div', 'highed-tooltip-text', key),
            option = highed.dom.cr('div', 'highed-chart-template-container highed-template-tooltip');

      const t = mostPopular[key];

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

      highed.dom.on(option, 'click', function() {
        t.header =  t.parent;
        events.emit('TemplateChanged', highed.merge({}, t), true);
        toNextPage();
      });

      highed.dom.ap(container, highed.dom.ap(option, preview, titleBar));
    });

    return container;
  }

  function getIcons() {
    return null;
  }

  function resize() {
    if (isVisible){

      expand()
      setTimeout(function() {
        resizeChart((((window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
      });
    }
  }

  if (!highed.onPhone()) {    
    highed.dom.on(window, 'resize', afterResize(function(e){
      resize();
    }));
  }

  function afterResize(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer);
      timer = setTimeout(func,100,event);
    };
  }

  function expand() {
      
    var newWidth = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) newWidth = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) newWidth = props.widths.phone;

    highed.dom.style(body, {
      width: 100 + '%',
      opacity: 1
    });
/*
    highed.dom.style(container, {
      width: newWidth + '%'
    });
*/




    if (!highed.onPhone()) {
      const windowWidth = highed.dom.size(parent).w;
      const percentage = ((100 - 68) / 100);
      
      var styles =  window.getComputedStyle(chartFrame);
      var containerStyles =  window.getComputedStyle(container);
      var chartMargin = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']),
          containerMargin = parseFloat(containerStyles['marginLeft']) + parseFloat(containerStyles['marginRight']);

      highed.dom.style(container, {
        width: ((windowWidth*percentage) - (chartMargin + containerMargin + 35) - 3/*margin*/ /*padding*/) + 'px'
      });

    }


    events.emit('BeforeResize', newWidth);

    // expanded = true;

    function resizeBody() {
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: (window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight) - highed.dom.pos(body, true).y
        };
          
        highed.dom.style(contents, {
          width: "100%",
          height: ((size.h - 16)) + 'px'
        });

        highed.dom.style(userContents, {
          width: size.w + 'px',
          height: ((size.h - 16) - 47) + 'px'
        });
        
      templates.resize(newWidth, (size.h - 17) - tsize.h);   

      return size;
    }

    setTimeout(resizeBody, 300);  
    highed.emit('UIAction', 'ToolboxNavigation', props.title);
  }

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
    
    expand();
    setTimeout(function() {
      resizeChart(((window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
    }, 200);
    isVisible = true;
  }
  
  function hide() {
    highed.dom.style(container, {
      display: 'none'
    });
    isVisible = false
  }

  function destroy() {}

  chartPreview.on('ChartChange', function(newData) {
    events.emit('ChartChangedLately', newData);
  });

  //////////////////////////////////////////////////////////////////////////////

  /**
   * Resize the chart preview based on a given width
   */
  function resizeChart(newHeight) {
    highed.dom.style(chartFrame, {
      /*left: newWidth + 'px',*/
      width: '68%',
      height: newHeight + 'px'
    });

    setTimeout(chartPreview.resize, 200);
  }

  chartPreview.on('SetResizeData', function () {
    //setToActualSize();
  });


  return {
    on: events.on,
    destroy: destroy,
    chart: chartPreview,
    getIcons: getIcons,
    resize: resize,
    hide: hide,
    show: show,
    createMostPopularTemplates: createMostPopularTemplates,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    selectSeriesTemplate: selectSeriesTemplate
    //toolbar: toolbar
  };
};
