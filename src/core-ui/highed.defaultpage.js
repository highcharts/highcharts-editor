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

highed.DefaultPage = function(parent, options, chartPreview, chartFrame) {
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
      'highed-box-size highed-toolbox-user-contents highed-toolbox-defaultpage'
    ),
    width,
    chartWidth = '68%',
    iconClass,
    icon = highed.dom.cr('div', iconClass),
    // Data table
    iconsContainer = highed.dom.cr('div', 'highed-icons-container'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    isVisible = false;
    
  function init() {
      
    width = options.widths.desktop;
    if (highed.onTablet() && options.widths.tablet) width = options.widths.tablet;
    else if (highed.onPhone() && options.widths.phone) width = options.widths.phone;

    customizeTitle = highed.dom.cr('div', 'highed-customize-title'/*, options.title*/),
    iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + options.icon;

    title.innerHTML = '';

    if (options.create && highed.isFn(options.create)) options.create(userContents, chartPreview, iconsContainer);

    highed.dom.ap(contents, /*highed.dom.ap(title,backIcon, customizeTitle, highed.dom.ap(iconsContainer,helpIcon)),*/ userContents);
    highed.dom.ap(body, contents);
  
    highed.dom.ap(parent, highed.dom.ap(container,body));

    expand();
    hide();
  }

  
  function afterResize(func){
    var timer;
    return function(event){
      if(timer) clearTimeout(timer);
      timer = setTimeout(func,100,event);
    };
  }

  function resize() {
    if (isVisible){
      expand()
      setTimeout(function() {
        resizeChart((((window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight) - highed.dom.pos(body, true).y) - 16));
      }, 1000);
      //expand();
    }
  }
  
  if (!highed.onPhone()) {
    highed.dom.on(window, 'resize', afterResize(function(e){
      resize();
    }));
  }

  function getIcons() {
    return iconsContainer;
  }

  function expand() {
    
    var newWidth = width; //props.width;

    highed.dom.style(body, {
      width: 100 + '%',
      opacity: 1
    });

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
          height: ((size.h - 16)) + 'px'
        });

      //customizer.resize(newWidth, (size.h - 17) - tsize.h);

      return size;
    }

    setTimeout(resizeBody, 300);  
    highed.emit('UIAction', 'ToolboxNavigation', options.title);
  }

  function show() {
    chartPreview.toggleShowAnnotationIcon(false);
    highed.dom.style(container, {
      display: 'block'
    });
    
    expand();
    setTimeout(function() {
      resizeChart(((window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight) - highed.dom.pos(body, true).y) - 15);
    }, 200);

    isVisible = true;
  }
  
  function hide() {

    //customizer.showSimpleEditor();
    
    width = options.widths.desktop;
    if (highed.onTablet() && options.widths.tablet) width = options.widths.tablet;
    else if (highed.onPhone() && options.widths.phone) width = options.widths.phone;
    chartWidth = "68%";
    
    highed.dom.style(backIcon, {
      display: "none"
    });
    //searchAdvancedOptions.hide();

    expand();

    highed.dom.style(container, {
      display: 'none'
    });

    isVisible = false;
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
      width: chartWidth, //'68%',
      height: newHeight + 'px' || '100%'
    });
/*
    highed.dom.style(chartContainer, {
      width: psize.w - newWidth - 100 + 'px',
      height: psize.h - 100 + 'px'
    });*/

    setTimeout(chartPreview.resize, 200);
  }

  return {
    on: events.on,
    destroy: destroy,
    chart: chartPreview,
    hide: hide,
    show: show,
    resize: resize,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    getIcons: getIcons
    //toolbar: toolbar
  };
};
