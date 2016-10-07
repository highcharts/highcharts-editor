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

/** This is a component that implements a toolbar with wizard steps 
  * Proxies the interface of the WizardStepper object.
  * @constructor
  * @emits Step - when stepping back or forth
  * @emits AddStep - when adding a step to the stepper
  * @param parent {domnode} - the dom node to attach the UI to
  * @param bodyParent {domnode} - the dom node to attach the stepper body to
  * @param attributes {object} - options for the object
*/
highed.WizardBar = function (parent, bodyParent, attributes) {
    var toolbar = highed.Toolbar(parent, { 
            additionalCSS: ['highed-wizstepper-bar'] 
        }),
        stepper = highed.WizardStepper(bodyParent, toolbar.center),
        next = highed.dom.cr('span', 'highed-wizstepper-next-prev fa fa-arrow-right'),
        previous = highed.dom.cr('span', 'highed-wizstepper-next-prev fa fa-arrow-left')
    ;

    ///////////////////////////////////////////////////////////////////////////

    function handleStepEvent(step, count) {
        if (step.number > 1) {
            highed.dom.style(previous, {
                opacity: 1,
                'pointer-events': 'auto',
                'visibility': 'visible'
            });
        } else {
            highed.dom.style(previous, {
                opacity: 0,
                'pointer-events': 'none',
                'visibility': 'hidden'
            });
        }

        if (step.number < count) {
            highed.dom.style(next, {
                opacity: 1,
                'pointer-events': 'auto',
                'visibility': 'visible'
            });
        } else {
            highed.dom.style(next, {
                opacity: 0,
                'pointer-events': 'none',
                'visibility': 'hidden'
            });
        }
    }

    stepper.on('Step', handleStepEvent);
    stepper.on('AddStep', handleStepEvent);

    highed.dom.on(next, 'click', stepper.next);
    highed.dom.on(previous, 'click', stepper.previous);

    ///////////////////////////////////////////////////////////////////////////

    highed.dom.ap(toolbar.right, next);
    highed.dom.ap(toolbar.left, previous);

    highed.dom.style(previous, {
        opacity: 0,
        'pointer-events': 'none'
    });

    return {
        /** The container which the bar is attached to
         *  @type {domnode}
         *  @memberof highed.WizardBar
         */
        container: toolbar.container,
        on: stepper.on,
        next: stepper.next,
        previous: stepper.previous,
        addStep: stepper.addStep
    };
};
