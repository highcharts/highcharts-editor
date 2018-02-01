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

/** Event dispatcher object
 *  Constructs an instance of an event dispatcher when called.
 *  @constructor
 *  @example
 *  var events = highed.events();
 *  events.on('foobar', function () {console.log('Hello world!')});
 *  events.emit('foobar');
 */
highed.events = function() {
  var callbacks = {},
    listenerCounter = 0;

  /** Listen to an event
      * @memberof highed.events
      * @param event {string} - the event to listen for
      * @param callback {function} - the function to call when the event is emitted
      * @param context {anything} - the calling context (`this` reference) for the callback
      * @returns {function} - function that can be called to unbind the listener
      */
  function on(event, callback, context) {
    var id = ++listenerCounter;

    if (highed.isArr(callback)) {
      return callback.forEach(function(cb) {
        on(event, cb, context);
      });
    }

    callbacks[event] = callbacks[event] || [];

    callbacks[event].push({
      id: id,
      fn: callback,
      context: context
    });

    return function() {
      callbacks[event] = callbacks[event].filter(function(e) {
        return e.id !== id;
      });
    };
  }

  return {
    on: on,

    /** Emit an event
         * Note that the function accepts a variable amount of arguments. Any arguments after the event name will be passed on to any event listeners attached to the event being emitted.
         * @memberof highed.events
         * @param event {string} - the event to emit
         * @return {number} - The number of events dispatched
         */
    emit: function(event) {
      var args = Array.prototype.slice.call(arguments);
      args.splice(0, 1);

      if (typeof callbacks[event] !== 'undefined') {
        callbacks[event].forEach(function(event) {
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
