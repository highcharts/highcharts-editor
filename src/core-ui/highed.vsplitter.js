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

highed.VSplitter = function (parent, attributes) {
    var properties = highed.merge({
            topHeight: 40,
            noOverflow: false
        }, attributes),
        container = highed.dom.cr('div', 'highed-vsplitter'),
        top = highed.dom.cr('div', 'panel top'),
        bottom = highed.dom.cr('div', 'panel bottom'),
        topBody = highed.dom.cr('div', 'highed-vsplitter-body'),
        bottomBody = highed.dom.cr('div', 'highed-vsplitter-body')
    ;

    ///////////////////////////////////////////////////////////////////////////

    //Force a resize of the splitter
    function resize(w, h) {
        var s = highed.dom.size(parent);

        highed.dom.style(container, {
            width: (s.w || w) + 'px',
            height: (s.h || h) + 'px'
        });

        //highed.dom.style([top, bottom, container], {
        //    width: (w || s.w) + 'px'
        //});
    }
    
    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(highed.dom.get(parent), 
        highed.dom.ap(container, 
            highed.dom.ap(top, topBody),
            highed.dom.ap(bottom, bottomBody)
        )
    );

    highed.dom.style(top, {
        height: properties.topHeight + '%'
    });

    highed.dom.style(bottom, {
        height: (100 - properties.topHeight) + '%'
    });

    if (properties.noOverflow) {
        highed.dom.style([container, top, bottom], {
            'overflow-x': 'hidden'
        });
    }

    ///////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        resize: resize,
        top: topBody,
        bottom: bottomBody
    };
};