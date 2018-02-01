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

highed.HelpModal = function(items) {
  var active = false,
    nav = highed.dom.cr('div', 'highed-help-nav'),
    body = highed.dom.cr('div'),
    counter = highed.dom.cr('div', 'highed-help-counter'),
    modal = highed.OverlayModal(false, {
      width: 600,
      height: 600
    });

  items.forEach(function(item, i) {
    var container = highed.dom.cr('div'),
      heading = highed.dom.cr('div', 'highed-toolbox-body-title', item.title),
      gif = highed.dom.cr('div', 'highed-help-gif'),
      desc = highed.dom.cr('div', 'highed-scrollbar highed-help-desc'),
      activate = highed.dom.cr('span', 'highed-icon fa fa-circle-o');

    if (highed.isArr(item.description)) {
      item.description = item.description.join(' ');
    }

    desc.innerHTML = item.description;
    if (item.gif) {
      item.gif = highed.option('helpImgPath') + item.gif;

      highed.dom.style(gif, {
        'background-image': 'url("' + item.gif + '")'
      });
    } else {
      highed.dom.style(gif, { display: 'none' });
    }

    function makeActive() {
      if (active) {
        active.className = 'highed-icon fa fa-circle-o';
      }

      body.innerHTML = '';
      activate.className = 'highed-icon fa fa-circle';
      highed.dom.ap(body, container);
      active = activate;

      counter.innerHTML = i + 1 + '/' + items.length;
    }

    highed.dom.on(activate, 'click', makeActive);

    highed.dom.ap(container, heading, gif, desc);

    highed.dom.ap(nav, activate);

    if (i === 0) {
      makeActive();
    }
  });

  if (items.length < 2) {
    highed.dom.style([nav, counter], {
      display: 'none'
    });
  }

  highed.dom.ap(modal.body, body, nav, counter);

  return {
    show: modal.show
  };
};
