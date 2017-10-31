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

// @format

highed.Toolbox = function(parent, attr) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-toolbox-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
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
          title: 'Tooltip Missing',
          icon: 'fa-trash',
          width: 200
        },
        def
      ),
      entryEvents = highed.events(),
      title = highed.dom.cr('div', 'highed-toolbox-body-title', props.title),
      contents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-inner-body'
      ),
      userContents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-user-contents'
      ),
      iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon,
      icon = highed.dom.cr('div', iconClass),
      exports = {};

    function resizeBody() {
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: bsize.h - tsize.h
        };

      highed.dom.style(contents, {
        width: size.w + 'px',
        height: size.h + 'px'
      });

      return size;
    }

    function expand() {
      var bsize = highed.dom.size(bar);
      var newWidth = bsize.w + props.width;

      if (expanded && activeItem === exports) {
        return;
      }

      console.log('expanding', newWidth);

      if (activeItem) {
        activeItem.disselect();
      }

      body.innerHTML = '';
      highed.dom.ap(body, contents);

      highed.dom.style(body, {
        width: props.width + 'px',
        height: bsize.h + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + 'px'
      });

      events.emit('BeforeResize', newWidth);

      expanded = true;

      setTimeout(function() {
        var height = resizeBody().h;

        events.emit('Expanded', exports, newWidth);
        entryEvents.emit('Expanded', newWidth, height - 20);
      }, 300);

      icon.className = iconClass + ' highed-toolbox-bar-icon-sel';
      activeItem = exports;
    }

    function collapse() {
      var newWidth = highed.dom.size(bar).w;

      if (expanded) {
        highed.dom.style(body, {
          width: '0px',
          opacity: 0.1
        });

        highed.dom.style(container, {
          width: newWidth + 'px'
        });

        events.emit('BeforeResize', newWidth);

        disselect();
        expanded = false;
        activeItem = false;
      }
    }

    function toggle() {
      if (activeItem === exports) {
        collapse();
      } else {
        expand();
      }
    }

    function disselect() {
      icon.className = iconClass;
    }

    highed.dom.on(icon, 'click', toggle);

    highed.dom.ap(bar, icon);

    highed.dom.ap(contents, title, userContents);

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

  function clear() {}

  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  return {
    clear: clear,
    on: events.on,
    addEntry: addEntry,
    width: width
  };
};
