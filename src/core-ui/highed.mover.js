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
 highed.Movable = function (target, constrain, constrainParent, parentNode) {
    var events = highed.events(),
        moving = false
    ;

    constrain = (constrain || 'XY').toUpperCase();
    target = highed.dom.get(target);

    if (target) {
        highed.dom.on(target, ['mousedown', 'touchstart'], function (e) {
         //   if (moving) return;
            moving = true;
            var cp = highed.dom.pos(target),
                ps = highed.dom.size(parentNode || target.parentNode),
                ns = highed.dom.size(target),
                x = cp.x,
                y = cp.y,
                offsetX = 0,
                offsetY = 0,
                mover = highed.dom.on(document.body, ['mousemove', 'touchmove'], function (moveE) {
                    if (constrain === 'X' || constrain === 'XY') {
                        x = cp.x + ((moveE.clientX || moveE.touches[0].clientX) - offsetX);                        
                    
                        if (constrainParent) {
                            if (x < 0) x = 0;
                            if (x > ps.w - ns.w) x = ps.w - ns.w;                            
                        }
                    }
                    if (constrain === 'Y' || constrain === 'XY') {
                        y = cp.y + ((moveE.clientY || moveE.touches[0].clientY) - offsetY);                        
                    
                        if (constrainParent) {                            
                            if (y < 0) y = 0;
                            if (y > ps.h - ns.h) y = ps.h - ns.h;
                        }
                    }

                    highed.dom.style(target, {
                        left: x + 'px',
                        top: y + 'px'
                    });

                    events.emit('Moving', x, y);

                    moveE.cancelBubble = true;
                    moveE.preventDefault();
                    moveE.stopPropagation();
                    moveE.stopImmediatePropagation();
                    return false;
                }),
                upper = highed.dom.on(document.body, ['mouseup', 'touchend'], function (upE) {                    
                    //Detach the document listeners
                    upper();
                    mover();    
                    moving = false;
                    document.body.className = document.body.className.replace(' highed-nosel', '');
                    events.emit('EndMove', x, y);

                    upE.cancelBubble = true;
                    upE.preventDefault();
                    upE.stopPropagation();
                    upE.stopImmediatePropagation();
                    return false;
                })
            ;

            document.body.className += ' highed-nosel';
            offsetX = e.clientX || e.touches[0].clientX;
            offsetY = e.clientY || e.touches[0].clientY;
            events.emit('StartMove', cp.x, cp.y);

            e.cancelBubble = true;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        });
    }

    ////////////////////////////////////////////////////////////////////////////

    return {
        on: events.on
    };
 };
