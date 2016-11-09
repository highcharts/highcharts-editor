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

/** Slider widget
 *  @constructor
 *
 *  @emits Change - when the value changes
 *
 *  @param parent {domnode} - the parent of the slider
 *  @param attributes {object} - the slider properties
 *    > max {number} - the max value
 *    > min {number} - the min value
 *    > step {number} - the step size
 *    > resetTo {anything} - value to reset to
 */
highed.Slider = function (parent, attributes) {
    var properties = highed.merge({
            max: 100,
            min: 1,
            step: 1,
            resetTo: 0,
            value: 0
        }, attributes),
        events = highed.events(),
        value = properties.value || properties.resetTo,
        container = highed.dom.cr('div', 'highed-slider'),
        indicator = highed.dom.cr('div', 'highed-slider-indicator'),
        textIndicator = highed.dom.cr('div', 'highed-slider-text-indicator'),
        sliderBackground = highed.dom.cr('div', 'highed-slider-background'),
        resetIcon = highed.dom.cr('div', 'highed-slider-reset fa fa-undo'),
        mover = highed.Movable(indicator, 'x', true, sliderBackground)
    ;

    ////////////////////////////////////////////////////////////////////////////


    function updateText() {
        textIndicator.innerHTML = value;

        if (value === 'null' || value === null) {
            textIndicator.innerHTML = 'auto';
        }
        if (value === 'undefined' || typeof value === 'undefined') {
            textIndicator.innerHTML = 'auto';
        }
    }

    // Calculate the indicator X
    function calcIndicator() {
        var x = 0,
            s = highed.dom.size(sliderBackground),
            ms = highed.dom.size(indicator)
        ;

        if (!highed.isNum(value) || !value) {            
            x = 0;
        } else {
            x = ((value - properties.min) / (properties.max - properties.min)) * (s.w - ms.w);            
        }

        highed.dom.style(indicator, {
            left: x + 'px'
        });
    }

    //Waits until the slider is in the dom
    function tryUpdateIndicators() {
        updateText();
        if (container.parentNode) {            
            calcIndicator();
        } else {
            window.setTimeout(tryUpdateIndicators, 10);
        }
    }

    /** Set the value
     *  @memberof highed.Slider
     *  @param newValue {number} - the new value
     */
    function set(newValue) {
        value = highed.clamp(properties.min, properties.max, newValue);
        textIndicator.innerHTML = value;
        calcIndicator();
    }

    mover.on('Moving', function (x) {
        var s = highed.dom.size(sliderBackground),
            ms = highed.dom.size(indicator)
        ;
        
        //Set the value based on the new X
        value = properties.min + Math.round(((x / (s.w - ms.w))) * (properties.max - properties.min));

        textIndicator.innerHTML = value;
        if (!highed.onPhone()) {
            events.emit('Change', value);
        }
    });

    mover.on('StartMove', function () {
        if (highed.onPhone()) {
            textIndicator.className = 'highed-slider-text-indicator highed-slider-text-indicator-popup';
        }
    });

    mover.on('EndMove', function () {
        if (highed.onPhone()) {
            textIndicator.className = 'highed-slider-text-indicator';
            //We're not emitting changes until done on mobile
            events.emit('Change', value);
        }
    });

    ////////////////////////////////////////////////////////////////////////////
    
    highed.dom.on(resetIcon, 'mouseover', function (e) {
      //  highed.Tooltip(e.clientX, e.clientY, 'Reset to initial value');
    });


    highed.dom.on(resetIcon, 'click', function() {
        value = properties.resetTo;
        calcIndicator();

        if (value === 'null') {
            value = null;
        }
        if (value === 'undefined') {
            value = undefined;
        }

        updateText();
        events.emit('Change', value);
    });

    if (parent) {
        parent = highed.dom.get(parent);
        highed.dom.ap(parent, container);
    }

    highed.dom.ap(container,
        sliderBackground,
        resetIcon,
        highed.dom.ap(indicator,
            textIndicator
        )
    );

    tryUpdateIndicators();

    // Public interface
    return {
        on: events.on,
        set: set,
        container: container
    };
};
