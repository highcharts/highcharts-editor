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

highed.AssignDataPanel = function(parent, attr) {

  function generateColors() {
    const hue = Math.floor(Math.random() * 360),
          saturation =  Math.floor(Math.random() * 100),
          lightness =  60;

    return {
      "light": "hsl(" + hue + ", " + saturation + "%, " + (lightness + 20) + "%)",
      "dark": "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
    };
  }

  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-assigndatapanel highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-assigndatapanel-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-assigndatapanel-body highed-box-size highed-transition'
    ),
    header = highed.dom.ap(
              highed.dom.cr('div', 'highed-assigndatapanel-header-container'), 
              highed.dom.cr('h3', 'highed-assigndatapanel-header', 'Select columns for this chart'),
              highed.dom.cr('p', 'highed-assigndatapanel-header-desc', 'Fill in the column id you want to visualise. Add multiple columns with a comma or hyphen (eg. A,B or A-C)'));
  
  var labels = highed.dom.cr('div', 'highed-assigndatapanel-data-options');




  function hide() {
    highed.dom.style(container, {
      display: 'none'
    });
  }


  function show() {
    highed.dom.style(container, {
      display: 'block'
    });
  }



  var label1Input = highed.dom.cr('input', 'highed-assigndatapanel-input');

  var colors1 = generateColors();
  highed.dom.style(label1Input, {
    "background": colors1.light,
    "border-color": colors1.dark
  });
  
  highed.dom.on(label1Input, 'blur', function() {
    events.emit('AssignDataChanged');
  });

  label1Input.value = 'A';

  var chartInput = highed.dom.cr('select', 'highed-assigndatapanel-select-input');
  var label1 = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                             highed.dom.cr('h6', '', 'Labels'),
                             highed.dom.cr('div', 'highed-assigndatapanel-data-desc', 'A column of names or times'),
                             label1Input);





  var label2Input = highed.dom.cr('input', 'highed-assigndatapanel-input');
  
  var colors = generateColors();
  highed.dom.style(label2Input, {
    "background": colors.light,
    "border-color": colors.dark
  });

  label2Input.value = 'B-C';
  var label2 = highed.dom.ap(highed.dom.cr('div', 'highed-assigndatapanel-data-option'), 
                            highed.dom.cr('h6', '', 'Values'),
                            highed.dom.cr('div', 'highed-assigndatapanel-data-desc', 'One or more columns of numbers'),
                            label2Input);





  highed.dom.ap(body, header);
  highed.dom.ap(labels, chartInput, label1, label2);
  highed.dom.ap(body, labels);
  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  return {
    on: events.on,
    hide: hide,
    show: show
  };
};
