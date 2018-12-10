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

/** Vertical splitter
 *  Splits a view into two vertical cells
 *
 *  @example
 *  var splitter = highed.VSplitter(document.body);
 *  highed.dom.ap(splitter.top, highed.dom.cr('div', '', 'Top!'));
 *  highed.dom.ap(splitter.bottom, highed.dom.cr('div', '', 'Bottom!'));
 *
 *  @constructor
 *  @param parent {domnode} - the parent to attach to
 *  @param attributes {object} - the settings for the splitter
 *    > topHeight {number} - the height in percent of the left cell. Alternatively, use '123px' to set a capped size.
 *    > noOverflow {bool} - whether or not overflowing is allowed
 */
highed.VSplitter = function(parent, attributes) {
  var properties = highed.merge(
      {
        topHeight: 40,
        noOverflow: false
      },
      attributes
    ),
    container = highed.dom.cr('div', 'highed-vsplitter'),
    top = highed.dom.cr('div', 'panel top highed-scrollbar'),
    bottom = highed.dom.cr('div', 'panel bottom highed-scrollbar'),
    topBody = highed.dom.cr('div', 'highed-vsplitter-body highed-scrollbar'),
    bottomBody = highed.dom.cr('div', 'highed-vsplitter-body highed-scrollbar');

  ///////////////////////////////////////////////////////////////////////////

  /** Force a resize of the splitter
     *  @memberof highed.VSplitter
     *  @param w {number} - the width of the splitter (will use parent if null)
     *  @param h {number} - the height of the splitter (will use parent if null)
     */
  function resize(w, h) {
    var s = highed.dom.size(parent);
    
    highed.dom.style(container, {
      height: '100%'
    });

    if (!w && !h) {
      
      highed.dom.style(top, {
        height: properties.topHeight
      })
      if (bottom) {
        highed.dom.style(bottom, {
          width: '100%',
          height:  (typeof properties.topHeight === 'string' ? 'calc(100% - ' + properties.topHeight + ')' : 100 - properties.topHeight + '%' )
        });
      }
      return;
    }
    highed.dom.style(container, {
      width: (w || s.w) + 'px',
      height: ((h || s.h)) + 'px'
    });

    if (properties.topHeight.toString().indexOf('px') > 0) {
      highed.dom.style(top, {
        height: properties.topHeight
      });

      highed.dom.style(bottom, {
        height: (h || s.h) - parseInt(properties.topHeight, 10) + 'px'
      });
    } else {
      highed.dom.style(top, {
        height: properties.topHeight + '%'
      });

      highed.dom.style(bottom, {
        height: 100 - properties.topHeight + '%'
      });
    }
    //highed.dom.style([top, bottom, container], {
    //    width: (w || s.w) + 'px'
    //});
  }

  ///////////////////////////////////////////////////////////////////////////

  highed.dom.ap(
    highed.dom.get(parent),
    highed.dom.ap(
      container,
      highed.dom.ap(top, topBody),
      highed.dom.ap(bottom, bottomBody)
    )
  );

  if (properties.noOverflow) {
    highed.dom.style([container, top, bottom], {
      'overflow-y': 'hidden'
    });
  }

  parent = highed.dom.get(parent);

  ///////////////////////////////////////////////////////////////////////////

  // Public interface
  return {
    resize: resize,
    /** The dom node for the top cell
         *  @memberof highed.VSplitter
         *  @type {domnode}
         */
    top: topBody,
    /** The dom node for the bottom cell
         *  @memberof highed.VSplitter
         *  @type {domnode}
         */
    bottom: bottomBody
  };
};
