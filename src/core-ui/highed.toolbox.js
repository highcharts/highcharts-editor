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

highed.Toolbox = function(parent, attr) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox wizard highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-toolbox-bar highed-box-size highed-wizard-title-container'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-toolbox-body-no-border highed-box-size highed-transition'
    ),
    activeTimeout,
    expanded = false,
    activeItem = false,
    properties = highed.merge(
      {
        animate: true
      },
      attr
    );

  function addEntry(def) {
    var props = highed.merge(
        {
          number: 0,
          title: 'Title Missing'
        },
        def
      ),
      entryEvents = highed.events(),
      title = highed.dom.cr('div', 'highed-toolbox-body-title wizard', props.hideTitle ? '' : props.title),
      contents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-inner-body'
      ),
      userContents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-user-contents'
      ),
      iconClass = 'highed-toolbox-list-item-container',
      icon = highed.dom.cr('div', iconClass),
      resizeTimeout,
      exports = {};

    highed.dom.ap(icon, highed.dom.cr('div', 'highed-toolbox-list-circle', props.number), highed.dom.cr('div', 'highed-toolbox-list-title', props.title));
    highed.dom.on(icon, 'click', function() {
      entryEvents.emit('Click');
    });

    function resizeBody() {
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: bsize.h - tsize.h - 55
        };
/*
      highed.dom.style(contents, {
        width: size.w + 'px',
        height: size.h + 'px'
      });
*/
      return size;
    }

    function expand() {
      var bsize = highed.dom.size(bar);
      
      var newWidth = props.width;

      if (expanded && activeItem === exports) {
        return;
      }

      if (props.iconOnly) {
        return;
      }

      if (activeItem) {
        activeItem.disselect();
      }

      entryEvents.emit('BeforeExpand');

      body.innerHTML = '';
      highed.dom.ap(body, contents);
      
      highed.dom.style(body, {
        height: (bsize.h - 55) + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + '%'
      });

      events.emit('BeforeResize', newWidth);

      expanded = true;

      setTimeout(function() {
        var height = resizeBody().h;

        events.emit('Expanded', exports, newWidth);
        entryEvents.emit('Expanded', newWidth, height - 20);
      }, 300);

      if (props.iconOnly) {
        activeItem = false;
      } else {
        icon.className = iconClass + ' active';
        activeItem = exports;
      }

      highed.emit('UIAction', 'ToolboxNavigation', props.title);
    }

    function collapse() {
      var newWidth = highed.dom.size(bar).w;

      if (expanded) {
        highed.dom.style(body, {
          width: '0px',
          opacity: 0.1
        });

        highed.dom.style(container, {
          width: newWidth + '%'
        });

        events.emit('BeforeResize', newWidth);

        disselect();
        expanded = false;
        activeItem = false;

      }
    }

    function toggle() {
        expand();
    }

    function disselect() {
      icon.className = iconClass + ' completed';
    }

    //highed.dom.on(icon, 'click', toggle);
    highed.dom.ap(bar, icon);
    highed.dom.ap(contents, title, userContents);

    function reflowEverything() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        highed.dom.style(body, { height: '' });
        if (expanded) {
          var height = resizeBody().h;
          entryEvents.emit('Expanded', highed.dom.size(bar), height - 20);
        }
      }, 100);
    }

    highed.dom.on(window, 'resize', reflowEverything);

    exports = {
      on: entryEvents.on,
      expand: expand,
      collapse: collapse,
      body: userContents,
      disselect: disselect
    };
    return exports;
  }

  function width() {
    var bodySize = highed.dom.size(body),
      barSize = highed.dom.size(bar);

    return bodySize.w + barSize.w;
  }

  function clear() {
    bar.innerHTML = '';
    body.innerHTML = '';
  }

  highed.dom.ap(parent, highed.dom.ap(container,bar,body));

  return {
    clear: clear,
    on: events.on,
    addEntry: addEntry,
    width: width
  };
};
