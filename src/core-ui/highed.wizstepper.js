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

/** A wizard-type stepper
 *  This is sort of like a tab control, but with a logical
 *  x -> y flow. 
 *
 *  @emits Step - when going back/forth
 *  @emits AddStep - when a new step is added
 * 
 *  @constructor
 *  @param bodyParent {domnode} - the node to attach the body to
 *  @param indicatorParent {domnode} - the node to attach the indicators to
 *  @param attributes {object} - the settings for the stepper
 *    > indicatorPos {enum} - the indicator alignment
 *       > top
 *       > bottom
 */
highed.WizardStepper = function(bodyParent, indicatorParent, attributes) {
    var properties = highed.merge({
            indicatorPos: 'top'         
        }, attributes),
        events = highed.events(),
        body = highed.dom.cr('div', 'highed-wizstepper-body'),
        indicators = highed.dom.cr('div', 'highed-wizstepper-indicators'),
        currentIndicator = highed.dom.cr('div', 'highed-wizstepper-current'),
        currentBubble = highed.dom.cr('div', 'highed-wizstpper-current-bubble'),

        activeStep = false,
        stepCount = 0,
        steps = [],
        ctx = highed.ContextMenu()
    ;

    ///////////////////////////////////////////////////////////////////////////

    /* Update the bar CSS - this is more stable than doing it in pure CS */
    function updateBarCSS() {
        var fsteps = steps.filter(function (t) { return t.visible; });
        
        stepCount = 0;

        fsteps.forEach(function (step, i) {
            if (i === 0) {
                step.bar.className = 'bar bar-first';
            } else if (i === fsteps.length - 1) {
                step.bar.className = 'bar bar-last';   
            } else {
                step.bar.className = 'bar';
            }

            step.number = ++stepCount;

            step.bar.className += ' ' + (properties.indicatorPos === 'bottom' ? 'bar-bottom' : 'bar-top');
        });
    }
    
    /** Add a new step
     *  @memberof highed.WizardStepper
     *  @param step {object} - an object describing the step
     *    > title {string} - the step title
     *  @returns {object} - interface to manipulate the step
     *    > activate {function} - function to activate the step
     *    > bubble {domnode} - the node for the bubble
     *    > body {domnode} - the node for the step body
     */
    function addStep(step) {        
        var stepexports = {
            number: ++stepCount,
            node: highed.dom.cr('div', 'highed-wizstepper-item'),
            label: highed.dom.cr('div', '', step.title, 'label'),
            bubble: highed.dom.cr('div', 'bubble ' + (properties.indicatorPos === 'bottom' ? 'bubble-bottom' : 'bubble-top')),
            bar: highed.dom.cr('div', 'bar ' + (properties.indicatorPos === 'bottom' ? 'bar-bottom' : 'bar-top')),
            body: highed.dom.cr('div', 'highed-step-body'),
            visible: true
        };

        stepexports.title = step.title;

        function activate() {
            if (activeStep) {
                activeStep.bubble.innerHTML = '';
                
                highed.dom.style(activeStep.bubble, {
                    height: '',
                    width: '',
                    bottom: '-4px',
                    'font-size': '0px'
                });

                highed.dom.style(activeStep.body, {
                    opacity: 0,
                    display: 'none',
                    'pointer-events': 'none'
                });

                if (properties.indicatorPos === 'top') {
                    highed.dom.style(activeStep.bubble, {
                        top: '-6px',
                        bottom: ''
                    });
                }

                activeStep.label.className = 'label-inactive';
                currentIndicator.innerHTML = step.title + ' - ' + stepexports.number + '/' + stepCount;
                //highed.dom.ap(currentIndicator, currentBubble);
                currentBubble.innerHTML = stepexports.number + '/' + stepCount;
            }

            stepexports.bubble.innerHTML = stepexports.number;
            
            highed.dom.style(stepexports.bubble, {
                height: "25px",
                width: "25px",
                bottom: '-8px',
                'font-size': '16px'
            });

            highed.dom.style(stepexports.body, {
                opacity: 1,
                display: 'block',
                'pointer-events': 'auto'
            });

            if (properties.indicatorPos === 'top') {
                highed.dom.style(stepexports.bubble, {
                    top: '-10px'
                });
            }

            activeStep = stepexports;
            activeStep.label.className = 'label-active';

            events.emit('Step', stepexports, stepCount, step);
        }

        stepexports.hide = function () {
            highed.dom.style(stepexports.node, {
                display: 'none'
            });
            if (stepexports.visible) {
                //This needs fixing
                stepCount--;
                stepexports.visible = false;
                updateBarCSS();                
            }
        };

        stepexports.visible = function () {
            return visible;
        };

        highed.dom.on(stepexports.node, 'click', activate);

        if (!activeStep) {
            activate();
        }       

        stepexports.activate = activate;

        steps.push(stepexports);
        
        updateBarCSS();

        highed.dom.ap(indicators, 
            highed.dom.ap(stepexports.node,
                stepexports.label,
                stepexports.bar,
                stepexports.bubble
            )
        );

        highed.dom.ap(body, stepexports.body);

        events.emit('AddStep', activeStep, stepCount);

        return stepexports;
    }

    /** Go to the next step 
     *  @memberof highed.WizardStepper
     */
    function next() {
        var fsteps = steps.filter(function (t) { return t.visible; });
        if (activeStep && activeStep.number < stepCount) {
            fsteps[activeStep.number].activate();
        }
    }

    /** Go to the previous step 
     *  @memberof highed.WizardStepper
     */
    function previous() {
        var fsteps = steps.filter(function (t) { return t.visible; });
        if (activeStep && activeStep.number > 1) {
            fsteps[activeStep.number - 2].activate();
        }
    }

    /** Force a resize of the splitter
     *  @memberof highed.WizardStepper
     *  @param w {number} - the width of the stepper (will use parent if null)
     *  @param h {number} - the height of the stepper (will use parent if null)
     */
    function resize(w, h) {
        var ps = highed.dom.size(bodyParent);

        highed.dom.style(body, {
            height: (h || ps.h) + 'px'
        });
    }

    /** Select the first step
      * @memberof highed.WizardStepper
      */
    function selectFirst() {        
        steps.some(function (step, i) {
            if (step.visible) {
                step.activate();
                return true;
            }
        });
    }

    highed.dom.on(currentIndicator, 'click', function (e) {
        var fsteps = steps.filter(function (t) { return t.visible; });

        ctx.build(fsteps.map(function (step) {
            return {
                title: step.title,
                click: step.activate,
                selected: activeStep.title === step.title
            };
        }));

        ctx.show(e.clientX, e.clientY);
    });

    ///////////////////////////////////////////////////////////////////////////
    
    highed.dom.ap(indicatorParent, indicators, highed.dom.ap(currentIndicator, currentBubble));
    highed.dom.ap(bodyParent, body);

    ///////////////////////////////////////////////////////////////////////////

    return {
        on: events.on,
        addStep: addStep,
        next: next,
        resize: resize,
        previous: previous,
        selectFirst: selectFirst,
        /** The main body
         *  @memberof highed.WizardStepper
         *  @type {domnode} 
         */
        body: body
    };
};
