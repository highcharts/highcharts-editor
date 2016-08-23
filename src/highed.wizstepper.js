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

highed.WizardStepper = function(bodyParent, indicatorParent, attributes) {
	var properties = highed.merge({
			indicatorPos: 'top'			
		}, attributes),
		events = highed.events(),
		body = highed.dom.cr('div', 'highed-wizstepper-body'),
		indicators = highed.dom.cr('div'),

		activeStep = false,
		stepCount = 0,
		steps = []
	;

	///////////////////////////////////////////////////////////////////////////

	/* Update the bar CSS - this is more stable than doing it in pure CS */
	function updateBarCSS() {
		steps.forEach(function (step, i) {
			if (i === 0) step.bar.className = 'bar bar-first';
			else if (i === steps.length - 1) step.bar.className = 'bar bar-last';
			else step.bar.className = 'bar';
			step.bar.className += ' ' + (properties.indicatorPos === 'bottom' ? 'bar-bottom' : 'bar-top');
		});
	}
	
	/* Add a new step
	 * @step - an object describing the step
	 */
	function addStep(step) {		
		var stepexports = {
			number: ++stepCount,
			node: highed.dom.cr('div', 'highed-wizstepper-item'),
			label: highed.dom.cr('div', '', step.title, 'label'),
			bubble: highed.dom.cr('div', 'bubble ' + (properties.indicatorPos === 'bottom' ? 'bubble-bottom' : 'bubble-top')),
			bar: highed.dom.cr('div', 'bar ' + (properties.indicatorPos === 'bottom' ? 'bar-bottom' : 'bar-top')),
			body: highed.dom.cr('div', 'highed-step-body')
		};

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
					'pointer-events': 'none'
				});

				if (properties.indicatorPos === 'top') {
					highed.dom.style(activeStep.bubble, {
						top: '-6px',
						bottom: ''
					});
				}
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
				'pointer-events': 'all'
			});

			if (properties.indicatorPos === 'top') {
				highed.dom.style(stepexports.bubble, {
					top: '-10px'
				});
			}

			activeStep = stepexports;

			events.emit('Step', stepexports, stepCount);
		}

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

	/* Go to the next step */
	function next() {
		if (activeStep && activeStep.number < stepCount) {
			steps[activeStep.number].activate();
		}
	}

	/* Go to the previous step */
	function previous() {
		if (activeStep && activeStep.number > 1) {
			steps[activeStep.number - 2].activate();
		}
	}

	/* Resize */
	function resize(w, h) {
		var ps = highed.dom.size(bodyParent);

		highed.dom.style(body, {
			height: (h || ps.h) + 'px'
		});
	}

	///////////////////////////////////////////////////////////////////////////
	
	highed.dom.ap(indicatorParent, indicators);
	highed.dom.ap(bodyParent, body);

	// addStep({title: 'Data'});
	// addStep({title: 'Templates'});
	// addStep({title: 'Customize'});
	// addStep({title: 'Use!'});

	///////////////////////////////////////////////////////////////////////////

	return {
		on: events.on,
		addStep: addStep,
		next: next,
		previous: previous,
		body: body,
		resize: resize
	};
};