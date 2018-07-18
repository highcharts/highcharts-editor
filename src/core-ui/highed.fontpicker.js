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
  /** Font picker
     *
     *  Creates a small font picking widget editing of:
     *      - bold
     *      - font family
     *      - font size
     *      - color
     *
     *  Note that this must be attached to the document manually by appending
     *  the returned container to something.
     *
     *  @example
     *  var picker = highed.FontPicker(function (newStyle) {
     *      highed.dom.style(document.body, newStyle);
     *  });
     *
     *  highed.dom.ap(document.body, picker.container);
     *
     *  @param fn {function} - the function to call when things change
     *  @param style {object} - the current style object
     *    > fontFamily {string} - the font family
     *    > color {string} - the font color
     *    > fontWeight {string} - the current font weight
     *    > fontStyle {string} - the current font style
     *  @returns {object} - an interface to the picker
     *    > container {domnode} - the body of the picker
     */
  highed.FontPicker = function(fn, style) {
    var container = highed.dom.cr('div', 'highed-font-picker'),
      fontFamily = highed.DropDown(), //highed.dom.cr('select', 'font-family'),
      fontSize = highed.DropDown(null, 'highed-font-size'), //highed.dom.cr('select', 'font-size'),
      boldBtn = highed.PushButton(false, 'bold'),
      italicBtn = highed.PushButton(false, 'italic'),
      color = highed.dom.cr('span', 'font-color', '&nbsp;');

    if (highed.isStr(style)) {
      try {
        style = JSON.parse(style);
      } catch (e) {}
    }

    ///////////////////////////////////////////////////////////////////////

    function callback() {
      if (highed.isFn(fn)) {
        fn(style);
      }
    }

    function updateColor(ncol, suppressCallback) {
      highed.dom.style(color, {
        background: ncol
      });

      style.color = ncol;
      if (!suppressCallback) {
        callback();
      }
    }

    ///////////////////////////////////////////////////////////////////////

    /** Set the current options
         *  @memberof highed.FontPicker
         *  @param options {object} - the options to set
         */
    function set(options) {
      if (highed.isStr(options)) {
        try {
          options = JSON.parse(options);
        } catch (e) {
          highed.log(0, 'Error in FontPicker::set');
          return;
        }
      }

      style = highed.merge(
        {
          fontFamily:
            '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif',
          color: '#333',
          fontSize: '18px',
          fontWeight: 'normal',
          fontStyle: 'normal'
        },
        options
      );

      //Set the current values
      boldBtn.set(style.fontWeight === 'bold');
      italicBtn.set(style.fontStyle === 'italic');
      updateColor(style.color, true);
      fontFamily.selectById(style.fontFamily);
      fontSize.selectById(style.fontSize.replace('px', ''));
    }

    //Add fonts to font selector
    fontFamily.addItems(highed.meta.fonts);
    //Add font sizes
    fontSize.addItems([8, 10, 12, 14, 16, 18, 20, 22, 25, 26, 28, 30, 32, 34]);

    set(style);

    //Listen to font changes
    fontFamily.on('Change', function(selected) {
      style.fontFamily = selected.id();
      return callback();
    });

    //Listen to font size changes
    fontSize.on('Change', function(selected) {
      style.fontSize = selected.id() + 'px';
      return callback();
    });

    //Listen to bold changes
    boldBtn.on('Toggle', function(state) {
      style.fontWeight = state ? 'bold' : 'normal';
      callback();
    });

    //Listen to italic changes
    italicBtn.on('Toggle', function(state) {
      style.fontStyle = state ? 'italic' : 'normal';
      callback();
    });

    //Handle color picker
    highed.dom.on(color, 'click', function(e) {
      highed.pickColor(e.clientX, e.clientY, style.color, updateColor);
    });

    //Create DOM
    highed.dom.ap(
      container,
      fontFamily.container,
      highed.dom.ap(
        highed.dom.cr('div', 'highed-font-picker-button-container'),
        fontSize.container,
        highed.dom.ap(
          highed.dom.cr('div', 'highed-font-picker-buttons'),
          boldBtn.button,
          italicBtn.button,
          color
        )
      )
    );

    ///////////////////////////////////////////////////////////////////////

    return {
      set: set,
      container: container
    };
  };
})();
