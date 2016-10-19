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

/** Make a node movable
 *  @constructor
 *
 *  @emits StartMove - when starting to move
 *  @emits Moving - when moving
 *  @emits EndMove - when stopping to move
 *
 *  @param target {domnode} - the node to make movable
 *  @param constrain {string} - constrain moving: `XY`, `Y`, or `X`
 */
 highed.Movable = function (target, constrain, constrainParent) {
    var events = highed.events()
    ;

    constrain = (constrain || 'XY').toUpperCase();
    target = highed.dom.get(target);

    if (target) {
        highed.dom.on(target, 'mousedown', function (e) {
            var cp = highed.dom.pos(target),
                ps = highed.dom.size(target.parentNode),
                ns = highed.dom.size(target),
                x = cp.x,
                y = cp.y,
                offsetX = 0,
                offsetY = 0,
                mover = highed.dom.on(document.body, 'mousemove', function (moveE) {
                    if (constrain === 'X' || constrain === 'XY') {
                        x = cp.x + (moveE.clientX - offsetX);                        
                    }
                    if (constrain === 'Y' || constrain === 'XY') {
                        y = cp.y + (moveE.clientY - offsetY);                        
                    }

                    if (constrainParent) {
                        if (x < 0) x = 0;
                        if (y < 0) y = 0;
                        if (x > ps.w - ns.w) x = ps.w - ns.w;
                        if (y > ps.h - ns.h) y = ps.h - ns.h;
                    }

                    highed.dom.style(target, {
                        left: x + 'px',
                        top: y + 'px'
                    });

                    events.emit('Moving', x, y);
                }),
                upper = highed.dom.on(document.body, 'mouseup', function () {                    
                    //Detach the document listeners
                    upper();
                    mover();    
                    document.body.className = document.body.className.replace(' highed-nosel', '');
                    events.emit('EndMove', x, y);
                })
            ;

            document.body.className += ' highed-nosel';
            offsetX = e.clientX;
            offsetY = e.clientY;
            events.emit('StartMove', cp.x, cp.y);
        });
    }

    ////////////////////////////////////////////////////////////////////////////

    return {
        on: events.on
    };
 };
