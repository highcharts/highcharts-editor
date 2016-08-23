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

highed.events = function () {
    var callbacks = {},
        listenerCounter = 0
    ;

    return {
        /* Attach an event listener
         * @event - the event to listen for
         * @callback - the callback to execute when the event is emitted
         * @context (optional) - the value of the this reference in the callback
         *
         * @returns a function that can be called to unbind the listener
         */
        on: function (event, callback, context) {
            var id = ++listenerCounter;

            callbacks[event] = callbacks[event] || [];

            callbacks[event].push({
                id: id,
                fn: callback,
                context: context
            });

            return function () {
                callbacks[event] = callbacks[event].filter(function (e) {
                    return e.id !== id;
                });
            };
        },

        /* Emit an event
         * @event - the event to emit
         *
         * @returns the number of events dispatched
         */
        emit: function (event) {
            var args = Array.prototype.slice.call(arguments);
            args.splice(0, 1);

            if (typeof callbacks[event] !== 'undefined') {

                callbacks[event].forEach(function (event) {
                    if (highed.isFn(event.fn)) {
                        event.fn.apply(event.context, args);
                    }
                });

                return callbacks[event].length;
            }
            return 0;
        }
    };
};