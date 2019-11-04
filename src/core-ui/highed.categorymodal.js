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

(function() {
  var container = highed.dom.cr(
      'div',
      'highed-category-modal highed-colorpicker-responsive'
    ),
    nameInput = highed.dom.cr('input', ''),
    valueInput = highed.dom.cr('input', ''),
    nameCallback = false,
    valueCallback = false,
    picker;

  //Attach the container to the document when the document is ready
  highed.ready(function() {
    highed.dom.ap(document.body, container);
  });

  highed.updateCategory = function(x, y, current, fn) {
    var windowSize = highed.dom.size(document.body),
      containerSize = highed.dom.size(container),
      dbinder = false;

    nameInput.value = current.name;
    valueInput.value = current.to;

    //Make sure we're not off screen
    if (x > windowSize.w - containerSize.w) {
      x = windowSize.w - containerSize.w - 10;
    }

    if (y > windowSize.h - containerSize.h) {
      y = windowSize.h - containerSize.h - 10;
    }

    highed.dom.style(container, {
      left: x + 'px',
      top: y + 'px',
      opacity: 1,
      'pointer-events': 'auto'
    });

    picker = highed.pickColor(null, null, current.color, function(col) {
      fn({ color: col });
    }, {
      hideCloseBtn: true,
      parent: container
    });

    if (nameCallback) nameInput.removeEventListener('keyup', nameCallback);
    if (valueCallback) valueInput.removeEventListener('keyup', valueCallback);

    nameCallback = function() {
      fn({ name: nameInput.value });
    };    
    
    valueCallback = function() {
      fn({ to: valueInput.value });
    };

    nameInput.addEventListener('keyup', nameCallback);
    valueInput.addEventListener('keyup', valueCallback);

    dbinder = highed.showDimmer(hide, true, true, 5);

    ///////////////////////////////////////////////////////////////////////

    /* Hide the picker */
    function hide() {
      highed.dom.style(container, {
        opacity: 0,
        left: '-20000px',
        'pointer-events': 'none'
      });
      dbinder();
      if (picker) picker.hide();
    }

    return {};
  };

  highed.dom.ap(container, 
                highed.dom.ap(highed.dom.cr('div'), highed.dom.cr('div', 'highed-category-label', 'Name:'), nameInput),
                highed.dom.ap(highed.dom.cr('div'), highed.dom.cr('div', 'highed-category-label', 'Value:'), valueInput));
})();
