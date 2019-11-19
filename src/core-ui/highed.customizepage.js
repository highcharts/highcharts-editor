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

highed.CustomizePage = function(parent, options, chartPreview, chartFrame, props, chartContainer, planCode, dataPage) {
  var events = highed.events(),
    // Main properties
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    title = highed.dom.cr('div', 'highed-toolbox-body-title'),
    customizeTitle,
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents test'
    ),
    helpIcon = highed.dom.cr(
      'div',
      'highed-toolbox-help highed-icon fa fa-question-circle'
    ),
    width,
    chartWidth = 68,
    iconClass,
    autoAppearanceTab = true,
    icon = highed.dom.cr('div', iconClass),
    helpModal,
    // Data table
    customizerContainer = highed.dom.cr('div', 'highed-box-size highed-fill'),
    customizer,
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    iconsContainer = highed.dom.cr('div', 'highed-icons-container'),
    annotationContainer,
    activeAnnotation = null,
    annotationButton,
    annotationOptions = [{
      className: 'highcharts-label-annotation',
      imageIcon: 'https://code.highcharts.com/7.1.2/gfx/stock-icons/label.svg',
      tooltip: 'Label'
    }, {
      className: "highcharts-segment",
      imageIcon: 'https://code.highcharts.com/7.1.2/gfx/stock-icons/segment.svg',
      tooltip: 'Line',
      submenu: [
        {className:"highcharts-segment", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/segment.svg"},
        {className:"highcharts-arrow-segment", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/arrow-segment.svg"},
        {className:"highcharts-ray", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/ray.svg"},
        {className:"highcharts-arrow-ray", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/arrow-ray.svg"},
        {className:"highcharts-infinity-line", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/line.svg"},
        {className:"highcharts-arrow-infinity-line", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/arrow-line.svg"},
        {className:"highcharts-horizontal-line", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/horizontal-line.svg"},
        {className:"highcharts-vertical-line", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/vertical-line.svg"},
      ]
    }, {
      className: "highcharts-crooked3",
      imageIcon: 'https://code.highcharts.com/7.1.2/gfx/stock-icons/elliott-3.svg',
      tooltip: 'Crooked Line',
      submenu: [
        {className:"highcharts-elliott3", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/elliott-3.svg"},
        {className:"highcharts-elliott5", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/elliott-5.svg"},
        {className:"highcharts-crooked3", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/crooked-3.svg"},
        {className:"highcharts-crooked5", imageIcon:"https://code.highcharts.com/7.1.2/gfx/stock-icons/crooked-5.svg"}
      ]
    },
    {
      tooltip: 'Close',
      icon: 'times',
      onClick: function() {
        closeAnnotationDropdown()

        annotationOptions.forEach(function(o) {
          o.element.classList.remove('active');
        });

        chartPreview.setIsAnnotating(false);
        annotationContainer.classList.remove('active');
      }
    }],
    disableAnnotation = false,
    buttons = [
      {
        tooltip: 'Basic',
        onClick: function() {
          reduceSize(customizer.showSimpleEditor);
        },
        icon: 'cog'
      },
      {
        tooltip: 'Advanced',
        noPermission: options.noAdvanced,
        onClick: function() {
          customizer.showAdvancedEditor();
        },
        icon: 'cogs'
      },
      {
        tooltip: 'Custom Code',
        noPermission: options.noCustomCode,
        onClick: function() {
          reduceSize(customizer.showCustomCode);
        },
        icon: 'code'
      },
      {
        tooltip: 'Preview Options',
        noPermission: options.noPreview,
        onClick: function() {

          reduceSize(customizer.showPreviewOptions);

        },
        icon: 'eye'
      }
    ],

    isVisible = false,
    searchAdvancedOptions = highed.SearchAdvancedOptions(parent),
    resolutionSettings = highed.dom.cr('span', 'highed-resolution-settings'),
    phoneIcon = highed.dom.cr('span', '', '<i class="fa fa-mobile" aria-hidden="true"></i>'),
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    tabletIcon = highed.dom.cr('span', '', '<i class="fa fa-tablet" aria-hidden="true"></i>'),
    stretchToFitIcon = highed.dom.cr('span', '', '<i class="fa fa-laptop" aria-hidden="true"></i>'),
    chartSizeText = highed.dom.cr('span', 'text', 'Preview Size:'),
    resWidth = highed.dom.cr('input', 'highed-res-number'),
    resHeight = highed.dom.cr('input', 'highed-res-number'),

    resolutions = [
      {
        iconElement: phoneIcon,
        width: 414,
        height: 736
      },
      {
        iconElement: tabletIcon,
        width: 1024,
        height: 768
      }
    ];

    resWidth.placeholder = 'W';
    resHeight.placeholder = 'H';

  function usingSafari() {
    return (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Mac') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
  }

  function closeAnnotationDropdown(){
    annotationOptions.forEach(function(option) {
      if (option.subContainer) {
        option.subContainer.classList.remove('active');
      }
    });
  }


  function init() {

    width = props.width,
    customizeTitle = highed.dom.cr('div', 'highed-customize-title'/*, props.title*/),
    iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon;

    customizerContainer.innerHTML = '';

    customizer = highed.ChartCustomizer(
      customizerContainer,
      options,
      chartPreview,
      planCode,
      dataPage
    ),
    helpModal = highed.HelpModal(props.help || []);

    customizer.on('PropertyChange', chartPreview.options.set);
    customizer.on('PropertySetChange', chartPreview.options.setAll);
    customizer.on('TogglePlugins', chartPreview.options.togglePlugins);

    customizer.on('AdvancedBuilt', function() {

      var bsize = highed.dom.size(body),
      size = {
        w: bsize.w,
        h: (window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y
      };

      searchAdvancedOptions.resize(width, (size.h - highed.dom.size(chartFrame).h) - 15);

      searchAdvancedOptions.setOptions(customizer.getAdvancedOptions());
    });

    customizer.on('AnnotationsClicked', function() {
      chartPreview.options.togglePlugins('annotations', 1);
    });

    customizer.on('AdvanceClicked', function() {

      width = 66;
      if (highed.onTablet()) width = 64;

      chartWidth = 28;
      highed.dom.style(backIcon, {
        display: "inline-block"
      });

      expand();
      resizeChart(300);

      setTimeout(chartPreview.resize, 1000);
      searchAdvancedOptions.show();
    });

    highed.dom.ap(resolutionSettings, chartSizeText, stretchToFitIcon, tabletIcon, phoneIcon, resWidth, resHeight);

    title.innerHTML = '';

    iconsContainer.innerHTML = '';

    if (!highed.onPhone()) {
      buttons.forEach(function(button, i) {
        if (button.noPermission) return;

        button.element = highed.dom.cr('span', 'highed-toolbox-custom-code-icon highed-template-tooltip ' + ( i === 0 ? ' active' : ''), '<i class="fa fa-' + button.icon + '" aria-hidden="true"></i><span class="highed-tooltip-text">' + button.tooltip + '</span>');

        highed.dom.on(button.element, 'click', function() {
          buttons.forEach(function(b){
            if (!b.noPermission)  b.element.classList.remove('active');
          });
          button.element.classList.add('active');
          button.onClick();
        });
        highed.dom.ap(iconsContainer, button.element);
      });
    }

    annotationButton = highed.dom.cr('span', 'highed-template-tooltip annotation-buttons annotation-button' + (usingSafari() ? ' usingsafari ' : '') , '<i class="fas fa-marker" aria-hidden="true"></i><span class="highed-tooltip-text">Annotations</span>');

    highed.dom.on(annotationButton, 'click', function() {

      if (disableAnnotation) return;

      if (planCode && planCode === 1) {
        // Show pay up dialog
        events.emit('Payup');
        return;
      }

      closeAnnotationDropdown();

      if (annotationContainer.classList.contains('active')) annotationContainer.classList.remove('active');
      else annotationContainer.classList.add('active');

    });

    if (!annotationContainer) {
      annotationContainer = highed.dom.cr('div', 'highed-transition highed-annotation-container tools-container');

      highed.dom.ap(annotationContainer, annotationButton);

      annotationOptions.forEach(function(option) {
        var btn = highed.dom.cr('span', 'highed-template-tooltip annotation-buttons ' + option.icon + ' ' + option.className + ' ' + (usingSafari() ? ' usingsafari ' : '') + (option.className ? ' highed-svg-icon' : ''),
                                '<i class="fa fa-' + option.icon + '" aria-hidden="true"></i><span class="highed-tooltip-text">' + option.tooltip + '</span>');

        if (option.imageIcon) {
          var img = highed.dom.cr('img');
          img.src = option.imageIcon;
          highed.dom.ap(btn, img);
        }

        var ellipses;
        if (option.submenu) {
          ellipses = highed.dom.cr('span', 'fas fa-ellipsis-h');
          var subContainer = highed.dom.cr('div', 'highed-annotation-submenu');
          option.subContainer = subContainer;
          option.btn = btn;

          option.submenu.forEach(function(submenuOption) {

            var subBtn = highed.dom.cr('span', 'highed-template-tooltip annotation-buttons ' + submenuOption.className + '-icon ' + (usingSafari() ? ' usingsafari ' : ''));

            highed.dom.on(subBtn, 'click', function() {
              if (disableAnnotation) return;

              btn.innerHTML = '<span class="highed-tooltip-text">' + option.tooltip + '</span>';
              btn.className = 'highed-template-tooltip annotation-buttons ' + submenuOption.icon + ' ' + submenuOption.className + ' ' + (usingSafari() ? ' usingsafari ' : '') + (submenuOption.className ? ' highed-svg-icon' : '')
              var img = highed.dom.cr('img');
              img.src = submenuOption.imageIcon;
              highed.dom.ap(btn, img);
              btn.click();
            });

            if (submenuOption.imageIcon) {
              var img = highed.dom.cr('img');
              img.src = submenuOption.imageIcon;
              highed.dom.ap(subBtn, img);
            }
            highed.dom.ap(subContainer, subBtn);
          });

          highed.dom.ap(ellipses, subContainer);

          highed.dom.on(ellipses, 'click', function(event){
            if (disableAnnotation) return;

            var isActive = subContainer.classList.contains('active');
            closeAnnotationDropdown();

            if (!isActive) subContainer.className += ' active';
          });

          //highed.dom.ap(btn, ellipses);

        }

        if (option.onClick || !option.draggable) {
          highed.dom.on(btn, 'click', function() {
            if (option.onClick) option.onClick();
          });
        }

        option.element = btn;
        highed.dom.ap(annotationContainer, btn, ellipses);
      });
    }

    highed.dom.ap(iconsContainer, annotationContainer);
    highed.dom.ap(contents, userContents);
    highed.dom.ap(body, contents);

    highed.dom.ap(userContents, customizerContainer);
    highed.dom.ap(parent, highed.dom.ap(container,body));

    //customizer.resize();

    expand();
    hide();
  }

  function getResolutionContainer() {
    return resolutionSettings;
  }

  function afterResize(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer);
      timer = setTimeout(func,100,event);
    };
  }

  function reduceSize(fn) {
    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;

    chartWidth = 68;

    expand();
    setTimeout(function() {
      if (fn) fn();
      resizeChart(((window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);
    }, 200);
  }

  function resize() {
    if (isVisible){
      expand()
      setTimeout(function() {

        resizeChart((((window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
      }, 500);
      //expand();
    }
  }

  if (!highed.onPhone()) {
    highed.dom.on(window, 'resize', afterResize(function(e){
      resize();
    }));
  }

  resolutions.forEach(function(res) {
    highed.dom.on(res.iconElement, 'click', function(){
      sizeChart(res.width, res.height);

      resWidth.value = res.width;
      resHeight.value = res.height;

      if (highed.chartType === 'Map') resize();
    });
  });

  highed.dom.on(stretchToFitIcon, 'click', function() {
    resWidth.value = '';
    resHeight.value = '';
    highed.dom.style(chartContainer, {
      width: '100%',
      height: '100%',
    });
    setTimeout(chartPreview.resize, 300);

    if (highed.chartType === 'Map') resize();
  }),

  backIcon = highed.dom.cr('div','highed-back-icon', '<i class="fa fa-chevron-circle-left" aria-hidden="true"></i>');


  highed.dom.style(backIcon, {
    display: "none"
  });


  highed.dom.on(backIcon, 'click', function(){

    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;

    chartWidth = 68;

    highed.dom.style(backIcon, {
      display: "none"
    });
    searchAdvancedOptions.hide();

    expand();
    resizeChart(((window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);

    setTimeout(customizer.showSimpleEditor, 200);
  });


  function hideAnnotationsOptions(){
    var blacklist = ['pie'];

    if (chartPreview.options.full && chartPreview.options.full.series) {
      disableAnnotation = chartPreview.options.full.series.some(function(series) {
        return blacklist.includes(series.type);
      });

      if (!disableAnnotation)
        annotationContainer.classList.remove('disable')
      else
        annotationContainer.className += ' disable'

    }
  }

  function expand() {

    var newWidth = width; //props.width;

    highed.dom.style(body, {
      width: 100 + '%',
      opacity: 1
    });


    if (!highed.onPhone()) {
      const windowWidth = highed.dom.size(parent).w;
      const percentage = ((100 - chartWidth) / 100);

      var styles =  window.getComputedStyle(chartFrame);
      var containerStyles =  window.getComputedStyle(container);
      var chartMargin = parseFloat(styles['marginLeft']) + parseFloat(styles['marginRight']),
          containerMargin = parseFloat(containerStyles['marginLeft']) + parseFloat(containerStyles['marginRight']);

      highed.dom.style(container, {
        width: ((windowWidth*percentage) - (chartMargin + containerMargin + 35) - 3 /*padding*/) + 'px'
      });
    }

    events.emit('BeforeResize', newWidth);

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

      customizer.resize(size.w, (size.h - 17) - tsize.h);

      return size;
    }

    setTimeout(resizeBody, 300);
    highed.emit('UIAction', 'ToolboxNavigation', props.title);
  }

  function show() {
    hideAnnotationsOptions()
    highed.dom.style(container, {
      display: 'block'
    });
    expand();

    resizeChart(((window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16);

    isVisible = true;
    highed.dom.style(resolutionSettings, {
      display: 'block'
    });


    if (autoAppearanceTab) {
      setTimeout(function() {
        if (!document.getElementById('highed-list-header-Appearance').classList.contains('active')){
          document.getElementById('highed-list-header-Appearance').children[0].click()
        }
      }, 300)
    }

  }

  function hide() {

    customizer.showSimpleEditor();

    width = props.widths.desktop;
    if (highed.onTablet() && props.widths.tablet) width = props.widths.tablet;
    else if (highed.onPhone() && props.widths.phone) width = props.widths.phone;

    chartWidth = 68;

    highed.dom.style(backIcon, {
      display: "none"
    });
    searchAdvancedOptions.hide();

    expand();

    highed.dom.style(container, {
      display: 'none'
    });
    isVisible = false;
    searchAdvancedOptions.hide();

    if (resolutionSettings) {
      highed.dom.style(resolutionSettings, {
        display: 'none'
      });
    }

    if (!highed.onPhone()){
      buttons.forEach(function(button, i) {

        if (button.noPermission) return;
        if (button.element) {
          button.element.classList.remove('active');
        }
        if (i === 0) button.element.classList += ' active';
      });
    }

    resHeight.value = '';
    resWidth.value = '';
  }

  function selectOption(event, x, y) {
    customizer.focus(event, x, y);
  }

  function setTabBehaviour(behaviour) {
    autoAppearanceTab = behaviour
  }

  function destroy() {}

  function showError(title, message) {
    highed.dom.style(errorBar, {
      opacity: 1,
      'pointer-events': 'auto'
    });

    errorBarHeadline.innerHTML = title;
    errorBarBody.innerHTML = message;
  }

  function sizeChart(w, h) {
    if ((!w || w.length === 0) && (!h || h.length === 0)) {
      fixedSize = false;
      resHeight.value = '';
      resWidth.value = '';
      resizeChart();
    } else {
      var s = highed.dom.size(chartFrame);

      // highed.dom.style(chartFrame, {
      //   paddingLeft: (s.w / 2) - (w / 2) + 'px',
      //   paddingTop: (s.h / 2) - (h / 2) + 'px'
      // });

      fixedSize = {
        w: w,
        h: h
      };

      w = (w === 'auto' ?  s.w : w || s.w - 100);
      h = (h === 'auto' ?  s.h : h || s.h - 100);

      highed.dom.style(chartContainer, {
        width: w + 'px',
        height: h + 'px'
      });

      //chartPreview.chart.setWidth();

      chartPreview.resize(w, h);
    }
  }

  highed.dom.on([resWidth, resHeight], 'change', function() {
    sizeChart(parseInt(resWidth.value, 10), parseInt(resHeight.value, 10));
  });

  chartPreview.on('ChartChange', function(newData) {
    events.emit('ChartChangedLately', newData);
  });

  function getIcons(){
    return iconsContainer;
  }

  function resizeChart(newHeight) {

    highed.dom.style(chartFrame, {
      /*left: newWidth + 'px',*/
      width: chartWidth + '%', //'68%',
      height: newHeight + 'px' || '100%'
    });
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    setTimeout(chartPreview.resize, 200);
  }


  chartPreview.on('SetResizeData', function () {
    //setToActualSize();
  });

  return {
    on: events.on,
    destroy: destroy,
    hide: hide,
    show: show,
    resize: resize,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    getIcons: getIcons,
    selectOption: selectOption,
    getResolutionContainer: getResolutionContainer,
    setTabBehaviour: setTabBehaviour
    //toolbar: toolbar
  };
};
