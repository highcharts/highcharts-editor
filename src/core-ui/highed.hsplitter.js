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

highed.HSplitter = function (parent, attributes) {
    var properties = highed.merge({
            leftWidth: 40,
            noOverflow: false
        }, attributes),
        container = highed.dom.cr('div', 'highed-hsplitter'),
        left = highed.dom.cr('div', 'panel left'),
        right = highed.dom.cr('div', 'panel right'),
        leftBody = highed.dom.cr('div', 'highed-hsplitter-body'),
        rightBody = highed.dom.cr('div', 'highed-hsplitter-body')
    ;

    ///////////////////////////////////////////////////////////////////////////

    //Force a resize of the splitter
    function resize(w, h) {
        var s = highed.dom.size(parent);

        highed.dom.style([left, right, container], {
            height: (h || s.h) + 'px'
        });
    }
    
    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(highed.dom.get(parent), 
        highed.dom.ap(container, 
            highed.dom.ap(left, leftBody),
            highed.dom.ap(right, rightBody)
        )
    );

    highed.dom.style(left, {
        width: properties.leftWidth + '%'
    });

    highed.dom.style(right, {
        width: (100 - properties.leftWidth) + '%'
    });

    if (properties.noOverflow) {
        highed.dom.style([container, left, right], {
            'overflow-y': 'hidden'
        });
    }

    parent = highed.dom.get(parent);

    ///////////////////////////////////////////////////////////////////////////

    // Public interface
    return {
        resize: resize,
        left: leftBody,
        right: rightBody
    };
};