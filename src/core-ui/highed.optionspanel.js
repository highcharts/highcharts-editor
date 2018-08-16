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

highed.OptionsPanel = function(parent, attr) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-optionspanel highed-box-size'
    ),
    body = highed.dom.cr(
      'div',
      'highed-optionspanel-body highed-box-size highed-transition'
    ),
    prev;

  highed.dom.ap(parent, highed.dom.ap(container, highed.dom.ap(body, highed.dom.cr('div', '', 'Workspace View:'))));

  function setDefault(option) {
    prev = option;
  }

  function addOption(option) {

    //attr.forEach(function(option) {
      var btn = highed.dom.cr(
        'a',
        'highed-optionspanel-button ', 
        option.text + '&nbsp;<i class="fa fa-' + option.icon + '"></i>'
      );
        
      (option.onClick || []).forEach(function(click) {
        highed.dom.on(btn, 'click', function() {
          click(prev, option);
        });
      });
  
      highed.dom.ap(body,btn);
  
    //});
  }

  function clearOptions() {
    body.innerHTML = '';
    highed.dom.ap(body, highed.dom.cr('div', 'highed-optionspanel-header', 'Workspace View:'));
  }

  return {
    on: events.on,
    addOption: addOption,
    setDefault: setDefault,
    clearOptions: clearOptions
  };
};
