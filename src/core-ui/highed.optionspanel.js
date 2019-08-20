/******************************************************************************

Copyright (c) 2016-2019, Highsoft

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

highed.OptionsPanel = function(parent, chartType) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-optionspanel highed-box-size'
    ),
    body = highed.dom.cr(
      'div',
      'highed-box-size highed-transition'
    ),
    prev,
    options = {},
    currentOption = null;

  highed.dom.ap(parent, highed.dom.ap(container, highed.dom.ap(body, highed.dom.cr('div', '', 'Workspace View:'))));

  function setDefault(option) {
    prev = option;
  }

  function addOption(option, id) {
    
    if (id === 'templates' && chartType === 'Map') return;

    var btn = highed.dom.cr(
      'a',
      'highed-optionspanel-button ' + (id === 'data' ? 'active' : ''), 
      option.text + '&nbsp;<i class="fa fa-' + option.icon + '"></i>'
    );
      
    (option.onClick || []).forEach(function(click) {
      highed.dom.on(btn, 'click', function() {
        Object.keys(options).forEach(function(o) {
          options[o].classList.remove('active');
        });
        currentOption = option;
        btn.classList.add('active');

        click(prev, option);
      });
    });

    options[id] = btn;
    
    highed.dom.ap(body,btn);
  }

  function clearOptions() {
    body.innerHTML = '';
    highed.dom.ap(body, highed.dom.cr('div', 'highed-optionspanel-header', 'Workspace View:'));
  }

  function getPrev() {
    return prev;
  }

  function getOptions() {
    return options;
  }

  function getCurrentOption() {
    return currentOption;
  }

  return {
    on: events.on,
    addOption: addOption,
    setDefault: setDefault,
    getPrev: getPrev,
    clearOptions: clearOptions,
    getOptions: getOptions,
    getCurrentOption: getCurrentOption
  };
};
