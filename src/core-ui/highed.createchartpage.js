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

highed.CreateChartPage = function(parent, options, props) {
  var events = highed.events(),
    builtInOptions = [
      'Title Your Chart',
      'Import Data',
      'Choose Template',
      'Customize'
    ],
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    title = highed.dom.cr('div', 'highed-toolbox-body-title'),
    contents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-inner-body'
    ),
    userContents = highed.dom.cr(
      'div',
      'highed-box-size highed-toolbox-user-contents highed-toolbox-dtable'
    ),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    listContainer = highed.dom.cr('div', 'highed-toolbox-createchart-list'),
    isVisible = false;

    function init(dataPage, customizePage, templatePage) {

      builtInOptions.forEach(function(option, index) {
        highed.dom.ap(listContainer, highed.dom.ap(highed.dom.cr('div', 'highed-toolbox-list-item-container'), highed.dom.cr('div', 'highed-toolbox-list-circle', index + 1), highed.dom.cr('div', 'highed-toolbox-list-title', option)));
      });

      highed.dom.ap(contents, userContents);
      highed.dom.ap(body, contents);
  
      highed.dom.ap(userContents, listContainer);
      
      highed.dom.ap(parent, highed.dom.ap(container, body));

      expand();
    }

    function resize() {
      if (isVisible) {
        expand();
      }
    }

    highed.dom.on(window, 'resize', resize);
    
    function expand() {
      //var bsize = highed.dom.size(bar);

      var newWidth = props.widths.desktop;
      if (highed.onTablet() && props.widths.tablet) newWidth = props.widths.tablet;
      else if (highed.onPhone() && props.widths.phone) newWidth = props.widths.phone;

      highed.dom.style(body, {
        width: 100 + '%',
        //height: //(bsize.h - 55) + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + '%'
      });

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
        width: size.w + 'px',
        height: ((size.h - 16)) + 'px'
      });
      
     }

    setTimeout(resizeBody, 300);
      highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
    isVisible = true;
    //expand();
    
  }
  function hide() {
    highed.dom.style(container, {
      display: 'none'
    });
    isVisible = false;
  }

  function destroy() {}

  function getIcons() {
    return null;
  }

  //////////////////////////////////////////////////////////////////////////////

  return {
    on: events.on,
    destroy: destroy,
    hide: hide,
    show: show,
    isVisible: function() {
      return isVisible;
    },
    init: init,
    getIcons: getIcons
  };
};
